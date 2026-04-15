const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { pseudo, mdp } = req.body;
    if (!pseudo || !mdp || pseudo.length < 3 || mdp.length < 4)
      return res.status(400).json({ error: 'Pseudo ou mot de passe trop court.' });

    const exists = await User.findOne({ pseudo });
    if (exists) return res.status(400).json({ error: 'Ce pseudo est déjà pris.' });

    const user = new User({ pseudo, mdp });
    await user.save();
    res.json({ message: 'Compte créé !' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { pseudo, mdp } = req.body;
    const user = await User.findOne({ pseudo });
    if (!user) return res.status(401).json({ error: "Ce pseudo n'existe pas." });

    const ok = await user.checkPassword(mdp);
    if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect.' });

    const token = jwt.sign({ pseudo }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, pseudo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;