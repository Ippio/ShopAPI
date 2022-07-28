const mongoose = require('mongoose')
const productGroupSchema = new mongoose.Schema({
    productID : {
        type: mongoose.Types.ObjectId,
        ref:'Product'
    },
    name: String,
    nameAscii: String,
    price: Number,
    productNameAscii: String,
    productTypeNameAscii: String,
    storage:String,
    storageAscii:String,
    listProductVariant:[{type:mongoose.Types.ObjectId , ref: 'ProductVariant'}],
})
module.exports = mongoose.model('ProductGroup',productGroupSchema,'ProductGroup')