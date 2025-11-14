const axios = require('axios');

class CurrencyConverter {
  constructor() {
    this.rates = {};
    this.lastUpdate = null;
  }

  async updateRates() {
    try {
      const response = await axios.get(`${process.env.EXCHANGE_RATE_API}USD`);
      this.rates = response.data.rates;
      this.lastUpdate = new Date();
      console.log('Exchange rates updated');
      return this.rates;
    } catch (error) {
      console.error('Error updating exchange rates:', error.message);
      return this.rates;
    }
  }

  convert(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (!this.rates[fromCurrency] || !this.rates[toCurrency]) {
      console.warn(`Missing exchange rate for ${fromCurrency} or ${toCurrency}`);
      return amount;
    }

    const amountInUSD = amount / this.rates[fromCurrency];
    const convertedAmount = amountInUSD * this.rates[toCurrency];

    return Math.round(convertedAmount * 100) / 100;
  }

  async convertWithUpdate(amount, fromCurrency, toCurrency) {
    const hoursSinceUpdate = this.lastUpdate
      ? (new Date() - this.lastUpdate) / (1000 * 60 * 60)
      : 24;

    if (!this.lastUpdate || hoursSinceUpdate > 24) {
      await this.updateRates();
    }

    return this.convert(amount, fromCurrency, toCurrency);
  }
}

module.exports = new CurrencyConverter();
