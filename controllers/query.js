const Product = require('../models/Product')
const ProductGroup = require('../models/ProductGroup')
const ProductVariant = require('../models/ProductVariant')
const Brand = require('../models/Brand')
const ProductType = require('../models/ProductType')
const User = require('../models/User')
const asynWrapper = require('../middleware/asyncWrapper')
const Order = require('../models/Order')
const Customer = require('../models/Customer')
const Review = require('../models/Review')

const query = asynWrapper(async (req, res) => {
    // const order= await Order.deleteMany()
    // const customer = await Customer.deleteMany()
    // const result = await Review.deleteMany()
    const result = await Customer.find()
    res.status(200).json({ msg: 'execute completed',result})
})

const getAdminHome = async(req,res)=>{
    const totalOrder = Order.find().countDocuments()
    const totalUser = User.find().countDocuments()
    const data = {
        totalOrder : await totalOrder,
        totalUser : await totalUser,
    }
    res.status(200).json({error:false, data})
}

module.exports = {
    query,
    getAdminHome
}