const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    product : {type:mongoose.Schema.ObjectId, ref:'Product'},
    customer : {type:mongoose.Schema.ObjectId, ref:'Customer'},
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:String,
},{timestamps:true})

module.exports = mongoose.model('Review',reviewSchema,'Review')