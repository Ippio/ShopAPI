const Product = require('../models/Product')
const ProductGroup = require('../models/ProductGroup')
const ProductVariant = require('../models/ProductVariant')
const Brand = require('../models/Brand')
const ProductType = require('../models/ProductType')
const User = require('../models/User')
const asynWrapper = require('../middleware/asyncWrapper')
const Order = require('../models/Order')
const Customer = require('../models/Customer')

const query = asynWrapper(async (req, res) => {
    
    const result = await User.find({})
    res.status(200).json({ msg: 'execute completed',result})
})

module.exports = {
    query
}