const Review = require('../models/Review')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')

// Public Route 
// GET Product Review  =>    Get /review/product/:id
const getProductReview = async(req,res)=>{
    const {id: productID} = req.params

    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const listReview = await Review.find({productID: productID}).limit(limit).skip(skip)
    res.status(StatusCodes.OK).json({error: false, listReview: listReview})
}

// Public Route 
// Create Review  =>    Post /review/product/:id
const createReview = async(req,res)=>{
    const {id: productID} = rea.params
    const {customerPhoneNumber , customerName } = req.body
    //Find customer
    const customer = await Customer.findOneAndUpdate({customerPhoneNumber : customerPhoneNumber},{customerPhoneNumber: customerName},{
        new:true,
        runValidators: true,
    })
    if(!customer) {
        res.status(StatusCodes.OK).json({error:false})
    }
    //check if customer is already made review
    if(customer.listReviewProduct.includes(productID)){
        res.status(StatusCodes.OK).json({error:false})
    }
    //check if customer did brought this product
    const listOrder = await Order.find({_id:customer.listOrder})
    const check = listOrder.filter((order)=>{
        if(order.orderItem.includes(productID)) return order
    })

    const listReview = await Review.find({productID: productID}).limit(limit).skip(skip)
    res.status(StatusCodes.OK).json({error: false, listReview: listReview})
}