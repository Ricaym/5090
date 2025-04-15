const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Envoie un email de confirmation
const sendConfirmationEmail = (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmation d\'inscription',
    text: `Bonjour ${name},\n\nMerci de t'être inscrit !\n\nClique ici pour confirmer ton inscription.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        } else {
        console.log('Email envoyé:', info.response);
        }
    });
};

// Route d'inscription
router.post('/register', async (req, res) => {
    const { nom, prenom, email, tel, adresse, ville, codePostal, password } = req.body;

    try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà inscrit' });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    const newUser = new User({
        nom,
        prenom,
        email,
        tel,
        adresse,
        ville,
        codePostal,
        password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Envoyer l'email de confirmation
    sendConfirmationEmail(email, prenom);

    // Réponse après l'inscription
    res.status(201).json({ message: 'Inscription réussie, un email de confirmation a été envoyé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
