// appel de model user
const userModel = require('../models/user.models');
// appel du modele de mot de passe
var passwordSchema = require("../models/password.models");
const ObjectID = require('mongoose').Types.ObjectId;
// appel de bcrypt
const bcrypt = require("bcrypt");
//appel de jsonwebtoken
const jwt = require('jsonwebtoken');
const validator = require("validator");

module.exports.signup = (req, res, next) => {
    const valideEmail = validator.isEmail(req.body.email);
    const validePassword = passwordSchema.validate(req.body.password);
    if (valideEmail === true && validePassword === true) {
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                userModel.create({
                    pseudo: req.body.pseudo,
                    email: req.body.email,
                    password: hash,
                    image: `${req.protocol}://${req.get(
                        "host"
                    )}/images/defaut/imagedefaut.png`,
                    moderateur: false,
                })
                    .then(() =>
                        res
                            .status(201)
                            .json({ message: "Utilisateur créé !" })
                    )
                    .catch((error) =>
                        res
                            .status(400)
                            .json({ error })
                    );
            })
            .catch((error) => res.status(400).json({ error }));
    } else {
        res.status(500).json({ error: "mot de passe ou email invalide" });
    }
};

module.exports.getAllUsers = async (req, res) => {
    const users = await userModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id)

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID inconnu : ' + err);
    }).select('-password');
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id)

    try {
        await userModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        )
            .then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id)

    try {
        await userModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Profil supprimer." });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

