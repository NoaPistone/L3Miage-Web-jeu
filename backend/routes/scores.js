const express = require('express');
const jwt = require('jsonwebtoken');
const Score = require('../models/Score');
const router = express.Router();

function auth(req, res, next) {
    const h = req.headers.authorization;
    if (!h) return res.status(401).json({ error: 'Non authentifié' });
    try {
        req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token invalide' });
    }
}



router.post('/', auth, async (req, res) => {
    try {
        const { jeu, score } = req.body;
        const { pseudo } = req.user;

        await Score.create({ pseudo, jeu, score });

        res.json({ saved: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { pseudo } = req.user;
        const jeux = ['jeu1', 'jeu2'];
        const result = {};
        for (const jeu of jeux) {
            const scores = await Score.find({ pseudo, jeu })
                .sort({ score: -1 }) 
                .limit(3)            
                .select('pseudo score date -_id');

            result[jeu] = scores;
        }
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;