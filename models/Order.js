const mongoose = require('mongoose')
const validator = require('validator');

const customerInfoSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number'],
    },
    address: {
        type: String,
        required: true
    },
    textNote: String
}, { _id: false })

const SingleOrderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    // productType: Object,
    // productVariant: mongoose.Types.ObjectId,
    // price: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { _id: false });

const orderSchema = mongoose.Schema({
    customerInfo: {
        type: customerInfoSchema,
        required: true
    },
    orderItems: [{
        type: SingleOrderItemSchema,
        required: true,
    }],
    status: {
        type: String,
        enum: ['Chưa duyệt', 'Duyệt', 'Đang giao', 'Hoàn tất', 'Hủy'],
        default: 'Chưa duyệt',
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 20000,
    },
    tax:Number,
    subTotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema, "Order")