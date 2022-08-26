const Order = require('../models/Order')
const Customer = require('../models/Customer')
const Product = require('../models/Product')
// const stringifyArray = require('../utils/stringifyArray')
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
    const totalOrders = await orders.clone().countDocuments()
    res.status(StatusCodes.OK).json({ error: false, orders: data, totalOrders: totalOrders })
}

// Public Route
// Create New Order  =>    POST /order/

const createOrder = async (req, res) => {
    const order = await Order.create(req.body)
    const customer = await Customer.findOneAndUpdate({ phoneNumber: req.body.customerInfo.phoneNumber }, { name: req.body.customerInfo.name, },
        {
            new: true,
            runValidators: true
        })
    if (!customer) {
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
        console.log(customer.listOrder)
        const listOrder = (customer.listOrder.length > 0) ? ([...String(customer.listOrder).split(','), String(order._id)]) : ([String(order._id)])
        const update = await Customer.findOneAndUpdate({ _id: customer._id }, { listOrder: listOrder }, { new: true, runValidators: true })
        console.log(update)
    }

    //update product 
    const orderItems = req.body.orderItems.reduce((arr,item)=>{
        arr.push(item.product)
        return arr
    },[])
    const products = await Product.find({_id:orderItems})
    products.forEach((item)=>{
        req.body.orderItems.forEach(product=>{
            console.log(product.product , String(item._id))

            if(product.product === String(item._id)) {
                item.quantity -= product.amount
                item.totalOrder++
                item.save()
            }
        })
    })  
    
    //response
    res.status(StatusCodes.CREATED).json({ error: false })
}

// Protected Route 
// Update Order  =>    PATCH /order/:id

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { status } = req.body
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

const searchOrder = async (req, res) => {
    const key = req.params.key.trim()
    const orders = await Product.find({ _id: { $regex: new RegExp('^' + key + '.*', 'i') } }).limit(32)
    if (orders.length === 0) throw new BadRequestError('There is no order')
    res.status(StatusCodes.OK).json({ error: false, orders: orders })
}

module.exports = {
    getListOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    searchOrder
}
