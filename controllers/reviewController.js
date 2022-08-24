const Review = require('../models/Review')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
// Public Route 
// GET Product Review  =>    Get /review/product/:id
const getProductReview = async(req,res)=>{
    const {id: productID} = req.params
    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const listReview = await Review.find({product: productID}).populate('customer','name').limit(limit).skip(skip).sort('-createdAt')

    res.status(StatusCodes.OK).json({error: false, listReview: listReview})
}

// Public Route 
// Create Review  =>    Post /review/product/:id
const createReview = async(req,res)=>{
    const {id: productID} = req.params
    const {phoneNumber , name } = req.body
    //Find customer
    const customer = await Customer.findOneAndUpdate({phoneNumber : phoneNumber},{name: name},{
        new:true,
        runValidators: true,
    })
    if(!customer) {
        throw new BadRequestError('User doesnt existed')
    }
    //check if customer is already made review
    if(customer.listReviewProduct.includes(productID)){
        throw new BadRequestError('customer is already made review')
    }
    //check if customer did brought this product
    const listOrder = await Order.find({_id:customer.listOrder})
    const boughtItems = listOrder.reduce((arr,item)=>{
        arr.push(...item.orderItems)
        return arr
    },[])
    const check = boughtItems.filter((item)=>{
        if(String(item.product) === productID){
            return item
        }
    })
    if(check.length === 0 ){
        throw new BadRequestError('You havent bought this product')
    }
    // create review
    const newReview = new Review({
        product:productID,
        customer: customer._id,
        rating: req.body.rating,
        comment : req.body.comment
    })
    newReview.save()
    //update customer
    customer.listReviewProduct = (customer.listReviewProduct.length > 0) ? ([...String(customer.listReviewProduct).split(','), String(productID)]) : ([String(productID)])
    customer.save()
    res.status(StatusCodes.CREATED).json({error: false,msg:'created review'})
}

module.exports = {
    createReview,
    getProductReview
}