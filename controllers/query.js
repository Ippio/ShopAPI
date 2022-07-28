const Product = require('../models/Product')
const ProductGroup = require('../models/ProductGroup')
const ProductVariant = require('../models/ProductVariant')
const Brand = require('../models/Brand')
const ProductType = require('../models/ProductType')
const User = require('../models/User')
const asynWrapper = require('../middleware/asyncWrapper')
const Order = require('../models/Order')

const query = asynWrapper(async (req, res) => {
    // const productList = await Product.find({},'productType nameExt')
    // const productTypeList = await ProductType.find({},'name')
    
    // await productTypeList.forEach(productType=>{
    //     productType.listProduct=[]
    //     productList.forEach(product=>{
    //         if(product.productType.toString() == productType._id.toString()) productType.listProduct.push(product._id)
    //     })
    // })

    // await productTypeList.forEach(async(item)=>{
    //     await ProductType.findByIdAndUpdate({_id:item._id},{listProduct: item.listProduct},{
    //         new:true,
    //         runValidators:true
    //     })
    // })
    const data = await Order.find()
    res.status(200).json({ msg: 'execute completed', data })
})

module.exports = {
    query
}