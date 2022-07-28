const mongoose = require('mongoose')
const brandSchema = new mongoose.Schema({
    id: Number,
    name:String,
    nameAscii:String,
    logoPicture:{
        type:String,
        default:null
    },
    listProduct:String,
    totalProduct:{
        type:Number,
        default : 0
    }
})
module.exports = mongoose.model('Brand',brandSchema,'Brand')