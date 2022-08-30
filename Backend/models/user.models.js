// appel de mangoose
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// création de schéma de connection d'utilisateur
const userSchema = new mongoose.Schema({
    // pseudo
    pseudo: { type: String, required: true, unique: true, trim: true },
    // email
    email: { type: String, required: true, unique: true, trim: true },
    // mot de passe
    password: { type: String, required: true },
    // image de profil
    image: { type: String, default: "" },
    // bio
    bio: { type: String, max: 1024, default: "" },
    // date dernière connexion
    date_deco: { type: Date, default: '2000-10-15 15:45:00' },
    // moderateur
    moderateur: { type: Boolean, default: false },
});

// exportation du shema modele
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;