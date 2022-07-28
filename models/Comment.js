const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
    {
        productId : String,
        listComment:[],
        totalRecord: Number,
        isShow:{
            type:Boolean,
            default : false
        }
    },
    {
        timestamps: true
    })
module.exports = mongoose.model('Comment',commentSchema,'Comment')