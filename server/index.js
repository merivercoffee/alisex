require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const currencyConverter = require('./utils/currencyConverter');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('express-cors');
app.use(
  cors({
    allowedOrigin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

currencyConverter.updateRates();
setInterval(() => currencyConverter.updateRates(), 24 * 60 * 60 * 1000);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
