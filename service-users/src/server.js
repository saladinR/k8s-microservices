const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check — K8s utilise ça pour savoir si l'app est vivante
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'service-users' });
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`service-users running on port ${PORT}`);
});

module.exports = app;