const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError,NotFoundError } = require('../errors')

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
    
    const data = await Order.find(queryObj).sort({ 'createdAt': -1 }).skip(skip).limit(limit).populate('product','nameExt')
    
    res.status(StatusCodes.OK).json({error: false, orders: data})
}

// Public Route
// Create New Order  =>    POST /order/

const createOrder = async (req, res) => {
    const newOrder = await Order.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({error: false ,order: newOrder })
}

// Protected Route 
// Update Order  =>    PATCH /order/:id

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const status = req.body
    const order = await order.findOneAndUpdate({ _id: orderId }, {status: status} , {
        new: true,
        runValidators: true,
    });

    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }
    res.status(StatusCodes.OK).json({ order });
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
