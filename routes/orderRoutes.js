const express = require('express')
const router = express.Router()

const {authenticateUser, authorizeRole} = require('../middleware/authentication')
const {
    getListOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    searchOrder
} = require('../controllers/orderController')

router.route('/order').get(getListOrder).post(createOrder)
router.route('/order/:id').patch(updateOrder).delete(deleteOrder)
router.route('/order/search/:key').get(searchOrder)

module.exports = router