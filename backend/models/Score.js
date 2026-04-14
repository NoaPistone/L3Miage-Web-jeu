const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  jeu:    { type: String, required: true },
  score:  { type: Number, required: true },
  date:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);