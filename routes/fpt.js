const express = require('express')
const router = express.Router()

const {
    getData
} = require('../controllers/get')

router.route('/').post(getData)

module.exports = router