const express = require('express')
const router = express.Router()

const {authenticateUser, authorizeRole} = require('../middleware/authentication')
const {
    getProductReview,
    createReview
} = require('../controllers/reviewController')

router.route('/review/:id').get(getProductReview).post(createReview)

module.exports = router