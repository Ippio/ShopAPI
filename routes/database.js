const express = require('express')
const router = express.Router()

const {
    query,
    getAdminHome
} = require('../controllers/query')

router.route('/api/db/query').get(query)
router.route('/AdminHome').get(getAdminHome)
module.exports = router