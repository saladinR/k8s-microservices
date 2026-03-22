const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connexion MongoDB avec retry
const connectDB = async () => {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connecté !');
      break;
    } catch (err) {
      console.log(`⏳ Tentative ${i+1}/${maxRetries} - ${err.message}`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
};

connectDB();

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'OK' : 'NOT_READY';
  res.json({ status: 'OK', service: 'service-users', db: dbStatus });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`service-users running on port ${PORT}`);
});

module.exports = app;