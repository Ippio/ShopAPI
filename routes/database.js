const express = require('express')
const router = express.Router()

const {
    query
} = require('../controllers/query')

router.route('/api/db/query').get(query)

module.exports = router