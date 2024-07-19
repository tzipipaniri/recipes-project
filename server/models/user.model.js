const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: [4, 'password length < 4'] },
    email: { type: String, required: true, unique: true},
    address:{type:String},
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
})

userSchema.pre('save', function (next) {
    const salt = +process.env.BCRYPT_SALT;
    bcrypt.hash(this.password, salt, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);

        this.password = hashPass;
        next()
    })
});

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('users', userSchema);

module.exports.userValidator = {
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(10).required()
        // password: Joi.string().custom(validateStrongPassword, "סיסמה חלשה").min(6).max(10).required(),
    }),
    newSchema: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string().min(4).max(10)
        // password: Joi.string().custom(validateStrongPassword, "סיסמה חלשה").min(6).max(10).required(),
    }),
}

module.exports.generateToken = (user) => {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; 
    const data = { role: user.role, user_id: user._id }; 
    const token = jwt.sign(data, privateKey, { expiresIn: '1h' }); 
    return token;
}
