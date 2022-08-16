// appel de model user
const UserModel = require('../models/user.models');
const userModel = require('../models/user.models');
const ObjetID = require('mongoose').Types.ObjectId;


module.exports.signup = async (req, res, next) => {
    const { pseudo, email, password } = req.body
    console.log('bonjour');

    try {
        const user = await userModel.create({ pseudo, email, password });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors })
    }
}

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!ObjetID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id)

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID inconnu : ' + err);
    }).select('-password');
};