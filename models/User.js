const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tel: { type: String, required: true },
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    password: { type: String, required: true },
    accountVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
