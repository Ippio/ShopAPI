const express = require('express')
const router = express.Router()

const {authenticateUser, authorizeRole} = require('../middleware/authentication')
const {
    getUser,
    getListUser,
    updateUser,
    deleteUser,
    searchUser
} = require('../controllers/userController')

router.route('/user').get(getListUser)
router.route('/user/:id').get(authenticateUser,getUser).patch(updateUser).delete(deleteUser)
router.route('/user/search/:key').get(searchUser)
module.exports = router