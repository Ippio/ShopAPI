const express = require('express')
const router = express.Router()
const {authenticateUser, authorizeRole} = require('../middleware/authentication')


const {
    getHome,
    getProductList,
    getProductDetail,
    FindByID,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController')

router.route('/product/:id').get(FindByID).post(authenticateUser,createProduct).patch(authenticateUser,updateProduct).delete(authenticateUser,authorizeRole('admin'),deleteProduct)
router.route('/home').get(getHome)
router.route('/product/type/:productType').get(getProductList)
router.route('/product/type/:productType/:name').get(getProductDetail)

module.exports = router