const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Ajouter cette ligne pour utiliser path
require('dotenv').config();

// Crée l'application Express
const app = express();
app.use(express.json());
app.use(cors());

// Connecte-toi à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.error('Erreur de connexion à MongoDB', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// app.get('/', (req, res) => {
//     res.send('Bienvenue sur le site de la carte graphique Nvidia 5090!');
// });

// Serve les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarre le serveur
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
