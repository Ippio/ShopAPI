const Order = require('../models/Order')
const Customer = require('../models/Customer')
const stringifyArray = require('../utils/stringifyArray')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')

// Protected Route
// GET LIST ORDER  =>    GET /order

const getListOrder = async (req, res) => {
    const { status } = req.query
    const queryObj = {}

    const page = Number(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    if (status) {
        queryObj.status = status
    }
    const orders = Order.find(queryObj)
    const data = await orders.sort({ 'createdAt': -1 }).skip(skip).limit(limit).populate('orderItems.product', 'name urlPicture price')
    const totalOrders= await orders.clone().countDocuments() 
    res.status(StatusCodes.OK).json({ error: false, orders: data, totalOrders:totalOrders })
}

// Public Route
// Create New Order  =>    POST /order/

const createOrder = async (req, res) => {
    const order = await Order.create(req.body)
    const customer = await Customer.find({ name: req.body.customerInfo.name, phoneNumber: req.body.customerInfo.phoneNumber })
    if (customer.length === 0) {
        const newCustomer = new Customer({
            name: req.body.customerInfo.name,
            email: req.body.customerInfo.email,
            phoneNumber: req.body.customerInfo.phoneNumber,
            listOrder: [order._id]
        })
        newCustomer.save()
        // Customer.create({ ...req.body.customerInfo, listOrder: [order._id] })
    }
    else {
        const listOrder = (customer[0].listOrder.length > 0) ? ([...String(customer[0].listOrder).split(','), String(order._id)]) : ([String(order._id)])
        const update = await Customer.findOneAndUpdate({ _id: customer[0]._id }, { listOrder: listOrder }, { new: true, runValidators: true })
        console.log(update)
    }
    // const newOrder = await Order.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({ error: false, order })
}

// Protected Route 
// Update Order  =>    PATCH /order/:id

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const {status} = req.body
    const order = await Order.findOneAndUpdate({ _id: orderId }, { status: status }, {
        new: true,
        runValidators: true,
    });

    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }
    res.status(StatusCodes.OK).json({ error: false, order });
};

// Protected Route 
// Delete Order =>    DELETE /order/:id

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id });

    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }

    order.remove();
    res.status(StatusCodes.OK).json({ msg: 'success! order removed' });

}

module.exports = {
    getListOrder,
    createOrder,
    updateOrder,
    deleteOrder
}
