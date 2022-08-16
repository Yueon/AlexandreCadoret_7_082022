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

// identification utilisateur grace a login
module.exports.login = (req, res, next) => {
    // on trouve l'adresse qui est rentré par l'utilisateur
    userModel.findOne({ email: req.body.email })
        .then(user => {
            // si la requete email ne correspond pas à un utilisateur 
            if (!user) {
                // status 401 Unauthorized et message en json
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            // si c'est ok bcrypt compare le mot de passe de user avec celui rentré par l'utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // retourne un status 401 Unauthorized et un message en json
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // si c'est ok status 201 Created et renvoi un objet json
                    res.status(200).json({
                        // renvoi l'user id
                        userId: user._id,
                        // renvoi un token encodé
                        token: jwt.sign(
                            // user id identique a la requete d'authentification
                            { userId: user._id },
                            // clé secrete pour encodage
                            process.env.TOKEN_SECRET_ALEATOIRE,
                            // durée de vie du token
                            { expiresIn: process.env.TOKEN_TEMP }
                        )
                    });
                })
                // erreur status 500 Internal Server Error et message en json
                .catch(error => res.status(500).json({ error }));
        })
        // erreur status 500 Internal Server Error et message en json
        .catch(error => res.status(500).json({ error }));
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

