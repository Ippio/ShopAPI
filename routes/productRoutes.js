const express = require('express')
const router = express.Router()

const {
    getHome,
    getProductList,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController')

router.route('/home').get(getHome)
router.route('/product/:productType').get(getProductList)
router.route('/product/:productType/:name').get(getProductDetail)

module.exports = router