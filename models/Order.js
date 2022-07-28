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
        type: Number,
        type: String,
        required: [true, 'Please provide phone number'],
    }
})

const SingleOrderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    productType: Object,
    productVariant: Object,
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const orderSchema = mongoose.Schema({
    customerInfo: {
        type:customerInfoSchema,
        required: true
    },
    orderItems: {
        type:SingleOrderItemSchema,
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'delivered', 'canceled', 'complete'],
        default: 'pending',
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 20000,
    },
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