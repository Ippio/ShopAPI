const mongoose = require('mongoose')
const productVariantSchema = new mongoose.Schema({
    productID : {
        type: mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    },
    colorName: String,
    listGallery: [String],
    stockQuantity: {    
        type: Number,
        default: Math.floor(Math.random() * 100) + 40
    }
})
module.exports = mongoose.model('ProductVariant',productVariantSchema,'ProductVariant')