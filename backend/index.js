/*const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const connectDB = require('./connect_db/connect_db');

connectDB();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));

  app.use(express.static(path.join(__dirname, '../')));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serveur en cours d'exécution sur le port ${process.env.PORT || 3000}`);
});*/

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');  // ← AJOUTER
dotenv.config();

const connectDB = require('./connect_db/connect_db');
connectDB();

const app = express();

// ← AJOUTER CES LIGNES
app.use(cors({
  origin: "https://l3-miage-web-home-page.vercel.app"
}));


app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/scores', require('./routes/scores'));
/*app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});*/

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serveur sur le port ${process.env.PORT || 3000}`);
});