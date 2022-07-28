const mongoose = require('mongoose')
const productVariantSchema = new mongoose.Schema({
    productID : {
        type: mongoose.Types.ObjectId,
        ref:'Product'
    },
    productGroupID : {
        type: mongoose.Types.ObjectId,
        ref:'ProductGroup'
    },
    colorName: String,
    colorImageUrl: String,
    stockQuantity: {
        type: Number,
        default: Math.floor(Math.random() * 100) + 40
    }
})
module.exports = mongoose.model('ProductVariant',productVariantSchema,'ProductVariant')