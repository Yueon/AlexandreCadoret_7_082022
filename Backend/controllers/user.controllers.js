// appel de model user
const userModel = require('../models/user.models');


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