import { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  // State variables
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentConversions, setRecentConversions] = useState([]);
  
  // Fake exchange rates (simulated data)
  const exchangeRates = {
    USD: { EUR: 0.91, GBP: 0.78, JPY: 153.2, CAD: 1.36, AUD: 1.49, INR: 83.16 },
    EUR: { USD: 1.10, GBP: 0.86, JPY: 168.35, CAD: 1.49, AUD: 1.64, INR: 91.39 },
    GBP: { USD: 1.28, EUR: 1.16, JPY: 195.77, CAD: 1.73, AUD: 1.91, INR: 106.34 },
    JPY: { USD: 0.0065, EUR: 0.0059, GBP: 0.0051, CAD: 0.0089, AUD: 0.0097, INR: 0.54 },
    CAD: { USD: 0.74, EUR: 0.67, GBP: 0.58, JPY: 113.20, AUD: 1.10, INR: 61.75 },
    AUD: { USD: 0.67, EUR: 0.61, GBP: 0.52, JPY: 102.82, CAD: 0.91, INR: 55.81 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.84, CAD: 0.016, AUD: 0.018 }
  };
  
  // List of available currencies with names
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
  ];
  
  // Function to handle currency conversion
  const convertCurrency = () => {
    setError('');
    
    // Input validation
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive number');
      return;
    }
    
    // Same currency check
    if (fromCurrency === toCurrency) {
      setConvertedAmount(parseFloat(amount));
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const rate = exchangeRates[fromCurrency][toCurrency];
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result);
        
        // Add to recent conversions
        const newConversion = {
          id: Date.now(),
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
          result,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setRecentConversions(prev => [newConversion, ...prev.slice(0, 4)]);
        setIsLoading(false);
      } catch (err) {
        setError('Conversion failed. Please try again.');
        setIsLoading(false);
      }
    }, 800); // 800ms delay to simulate network request
  };
  
  // Function to swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };
  
  // Function to reset form
  const resetForm = () => {
    setAmount('');
    setFromCurrency('USD');
    setToCurrency('EUR');
    setConvertedAmount(null);
    setError('');
  };
  
  // Format currency display
  const formatCurrency = (value, currency) => {
    if (value === null) return '';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Currency Converter</h1>
          
          {/* Amount Input */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Currency Selection */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="col-span-2">
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currencies.map((currency) => (
                  <option key={`from-${currency.code}`} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Swap Button */}
            <div className="flex items-end justify-center">
              <button 
                onClick={swapCurrencies}
                className="mb-1 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
                aria-label="Swap currencies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currencies.map((currency) => (
                  <option key={`to-${currency.code}`} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button 
              onClick={convertCurrency}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : "Convert"}
            </button>
            <button 
              onClick={resetForm}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {/* Conversion Result */}
          {convertedAmount !== null && !error && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Conversion Result:</div>
              <div className="text-lg font-semibold">
                {formatCurrency(parseFloat(amount), fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Exchange Rate: 1 {fromCurrency} = {exchangeRates[fromCurrency][toCurrency].toFixed(4)} {toCurrency}
              </div>
            </div>
          )}
          
          {/* Recent Conversions */}
          {recentConversions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Recent Conversions</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentConversions.map((conversion) => (
                      <tr key={conversion.id}>
                        <td className="px-4 py-2 text-xs text-gray-500">{conversion.timestamp}</td>
                        <td className="px-4 py-2 text-sm">
                          {formatCurrency(conversion.amount, conversion.fromCurrency)} = {formatCurrency(conversion.result, conversion.toCurrency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-xs text-center text-gray-500">
          This is a demo using fake exchange rates for educational purposes only.
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;