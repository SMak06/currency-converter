import React, { useEffect, useState } from 'react';
import './App.css';
import CurrenyRow from './CurrenyRow';

var myHeaders = new Headers();
myHeaders.append("apikey", "fyVZgcEkaU7l5k8tckeI7Tqj9J8kJxKk");

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

const CURRENCY_URL = 'https://api.apilayer.com/exchangerates_data/latest';

function App() {

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState([]);
  const [toCurrency, setToCurrency] = useState([]);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState([]);

  let fromAmount, toAmount;
  if(amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(CURRENCY_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = [Object.keys(data.rates)[0]]
      setCurrencyOptions([...Object.keys(data.rates)])
      setToCurrency(firstCurrency)
      setFromCurrency(data.base)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if(fromCurrency !== null && toCurrency !== null) {
      fetch(`${CURRENCY_URL}?base=${fromCurrency}&symbols=${toCurrency}`, requestOptions)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])
  

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false);
  }
  
  return (
    <>
      <h1>Currency Conversion</h1>
      <CurrenyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {fromCurrency}
        onChangeCurrency = {e => setFromCurrency(e.target.value)}
        amount = {fromAmount}
        onChangeAmount = {handleFromAmountChange}
      />
      <div className='equals'>=</div>
      <CurrenyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {toCurrency}
        onChangeCurrency = {e => setToCurrency(e.target.value)}
        amount = {toAmount}
        onChangeAmount = {handleToAmountChange}
      />
    </>
  );
}

export default App;
