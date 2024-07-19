const express = require('express');
const { signIn, signUp, updateUser, getAllUsers } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/',getAllUsers)

router.post('/signin', signIn)

router.post('/signup', signUp)

router.put('/:id', auth, updateUser);

module.exports = router;