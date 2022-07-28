const express = require('express')
const router = express.Router()

const {authenticateUser, authorizeRole} = require('../middleware/authentication')
const {
    getListOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController')

router.route('/order').get(authenticateUser,getListOrder).post(createOrder)
router.route('/order/:id').patch(authenticateUser,updateOrder).delete(authenticateUser,authorizeRole('admin'),deleteOrder)

module.exports = router