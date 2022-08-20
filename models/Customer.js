const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide username'],
        maxlength: 50,
        minlength: 3,
    },
    email: String,
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number'],
        maxlength: 10,
        minlength: 3,
    },
    listOrder:[{
        type:mongoose.Types.ObjectId,
        ref:'Order'
    }],
    listReviewProduct:[{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    }]
})

module.exports = mongoose.model('Customer', UserSchema,'Customer')