const Product = require('../models/Product')
// const ProductDetail = require('../models/ProductDetail')
// const ListReview = require('../models/ListReview')
// const ListComment = require('../models/ListComment')
// const Rates = require('../models/Rates')
const asyncWrapper = require('../middleware/asyncWrapper')

const getData = asyncWrapper(async(req,res)=>{
    const {product,ListComment,listReview,rates, productDetail} = req.body
    if(product){
        await Product.create(product)
    }
    res.json({error:false})
})

module.exports = {
    getData
}