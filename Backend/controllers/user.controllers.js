// appel de model user
const userModel = require('../models/user.models');
// appel du modele de mot de passe
var passwordSchema = require("../models/password.models");
const ObjectID = require('mongoose').Types.ObjectId;
// appel de bcrypt
const bcrypt = require("bcrypt");
const { uploadErrors } = require("../utils/errors.utils");
//appel de jsonwebtoken
const jwt = require('jsonwebtoken');
const validator = require("validator");
const multer = require('../middleware/multer-config')
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

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
                    )}/images/default/default_profile.png`,
                    moderateur: false,
                    date_deco: '2000-10-15 15:45:00'
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

module.exports.login = (req, res, next) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET_ALEATOIRE,
                            { expiresIn: process.env.TOKEN_TEMP }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

module.exports.logout = (req, res, next) => {
    let dateDeco = new Date();
    userModel.findOne({
        where: { id: req.body.userId, email: req.body.email },
    })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error });
            } else {
                userModel.update(
                    {
                        date_deco: dateDeco,
                    },
                    {
                        where: {
                            id: req.body.userId,
                        },
                    }
                )
                    .then(() => res.status(200).send(console.log('deconnection le: ' + dateDeco)))
                    .catch((error) => res.status(400).json({ error }));
                res.status(200).send("utilisateur déconnecté le " + dateDeco);
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

module.exports.getAllUsers = async (req, res) => {
    const users = await userModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id)

    userModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID inconnu : ' + err);
    }).select('-password');
};


exports.updateUser = (req, res, next) => {
    const imageObject = req.file ?
        {
            image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    userModel.updateOne({ _id: req.params.id }, { ...imageObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified!' }))
        .catch(error => res.status(400).json({ error }));
}

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

