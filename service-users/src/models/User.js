const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,    // obligatoire
    trim: true         // supprime les espaces avant/après
  },
  email: {
    type: String,
    required: true,
    unique: true,      // pas deux users avec le même email
    lowercase: true    // stocke toujours en minuscules
  },
  role: {
    type: String,
    enum: ['user', 'admin'],   // seulement ces 2 valeurs autorisées
    default: 'user'
  }
}, {
  timestamps: true    // ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('User', userSchema);