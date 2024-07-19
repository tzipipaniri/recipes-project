const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User, generateToken } = require("../models/user.model");


exports.signIn = async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username })

    if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
            if (err)
                return next(new Error(err.message));

            if (same) {
                const token = generateToken(user);
                user.password = "****";
                return res.send({ user, token });
            }
            return next({ message: 'Auth Failed', status: 401 })
        })
    }
    else {
        return next({ message: 'Auth Failed', status: 401 })
    }
}

exports.signUp = async (req, res, next) => {
    const {firstName,lastName,username,password,email,address,role} = req.body;

    try {
        const user = new User({firstName,lastName,username,password,email,address,role});
        await user.save();

        const token = generateToken(user);
        user.password = "****";
        return res.status(201).json({ user, token });
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }
}

exports.getAllUsers = async (req, res, next) => {
    let {firstName,lastName,username,password,email,address,role} = req.query;
    try {
        const users = await User.find().select('-__v')
        return res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {

        if (id !== updatedUser._id)
            return next({ message: 'user id conflict', status: 409 });
        else if (req.user.user_id === id) {
            const u = await User.findByIdAndUpdate(
                id,
                { $set: updatedUser },
                { new: true } 
            )
            return res.json(u);
        }
        else { 
            next({ message: `cannot update user: ${id}, you can update only your details`, status: 403 })
        }
    } catch (error) {
        next(error);
    }
};
