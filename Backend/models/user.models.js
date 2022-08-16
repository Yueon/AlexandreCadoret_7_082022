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
    bio: { type: String, max: 1024, },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// exportation du shema modele
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;