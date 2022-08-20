const mongoose = require('mongoose')

const listBrandSchema = new mongoose.Schema({
    brand: {type:mongoose.Types.ObjectId , ref: 'Brand'},
    listProduct : [{type:mongoose.Types.ObjectId , ref: 'Product'}],
    totalProduct : Number,
})

const productTypeSchema = new mongoose.Schema({
    name:String,
    nameAscii:String,
    subName:String,
    totalProduct:Number,
    // listProduct:[{type:mongoose.Types.ObjectId , ref: 'Product'}]
})

module.exports = mongoose.model('ProductType',productTypeSchema,'ProductType')