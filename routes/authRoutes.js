const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')

const { register, login, logout } = require('../controllers/authController')

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)
router.route('/auth/logout').get(logout)

module.exports = router