const Product = require('../models/Product')
const ProductGroup = require('../models/ProductGroup')
const ProductVariant = require('../models/ProductVariant')
const Brand = require('../models/Brand')
const ProductType = require('../models/ProductType')
const User = require('../models/User')
const asynWrapper = require('../middleware/asyncWrapper')
const Order = require('../models/Order')

const query = asynWrapper(async (req, res) => {

    const data = await Product.find({listProductGroupDetail:[]},'_id price nameExt listProductGroupDetail')
    // await data.forEach(async(product)=>{
    //     await Product.findOneAndUpdate({_id: product._id},{price : Number(Math.floor(Math.random() * 20000000) + 3000000)},{
    //         new:true,
    //         runValidators: true
    //     })
    // })
    res.status(200).json({ msg: 'execute completed',data})

})

module.exports = {
    query
}