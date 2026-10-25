const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('DB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/check', require('./routes/check'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));