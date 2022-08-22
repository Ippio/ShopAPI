const express = require('express')
const router = express.Router()
const {authenticateUser, authorizeRole} = require('../middleware/authentication')
const upload = require('../middleware/multer-upload')

const {
    getHome,
    getProductList,
    getProductDetail,
    FindByID,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
} = require('../controllers/productController')


router.route('/product/:id').get(FindByID).delete(authenticateUser,authorizeRole('admin'),deleteProduct).patch(upload.single('urlPicture'),updateProduct)
router.route('/home').get(getHome)
router.route('/product').post(upload.single('urlPicture'),createProduct)
router.route('/product/type/:productType').get(getProductList)
router.route('/product/type/:productType/:name').get(getProductDetail)
router.route('/product/search/:key').get(searchProduct)

module.exports = router