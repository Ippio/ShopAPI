const mongoose = require('mongoose')
const ProductType = require('./ProductType')
const productSchema = new mongoose.Schema({
    attachedAccessories: {
        type: String
    },
    brand: { type: mongoose.Types.ObjectId, ref: 'Brand' },
    createBy: {
        type: String
    },
    description: {
        type: String
    },
    details: {
        type: String
    },
    guideDesktop: {
        type: String
    },
    guideMobile: {
        type: String
    },
    id: {
        type: String
    },
    labelID: {
        type: Number
    },
    labelName: {
        type: String
    },
    listAttrDetailShort: {
        type: Array,
        attributeID: {
            type: String
        },
        attributeName: {
            type: String
        },
        icon: {
            type: String
        },
        specName: {
            type: String
        },
    },
    listPicture360: {
        type: Array,
        id: { type: Number },
        name: { type: String },
        folder: { type: String },
        displayOrder: { type: Number },
        url: { type: String }
    },
    listPictureBreakBox: {
        type: Array,
        id: { type: Number },
        name: { type: String },
        folder: { type: String },
        displayOrder: { type: Number },
        url: { type: String }
    },
    listPictureFromCamera: {
        type: Array,
        id: { type: Number },
        name: { type: String },
        folder: { type: String },
        displayOrder: { type: Number },
        url: { type: String }
    },
    listPictureGallery: {
        type: Array,
        id: { type: Number },
        name: { type: String },
        folder: { type: String },
        displayOrder: { type: Number },
        url: { type: String }
    },
    listPictureInBox: {
        type: Array,
        id: { type: Number },
        name: { type: String },
        folder: { type: String },
        displayOrder: { type: Number },
        url: { type: String }
    },
    listPictureSlide: [],
    listProductGroupDetail: [{ type: mongoose.Types.ObjectId, ref: 'ProductGroup' }],
    listProductVariant: [{ type: mongoose.Types.ObjectId, ref: 'ProductVariant' }],
    isComingSoon: { type: Boolean },
    name: { type: String },
    nameAscii: { type: String },
    nameCate: { type: String },
    nameExt: { type: String },
    preOrderDateEnd: { type: String },
    preOrderDateStart: { type: String },
    productAttributes: {
        type: Array,
        attributeID: { type: Number },
        attributeName: { type: String },
        groupName: { type: String },
        specID: { type: Number },
        specName: { type: Number },
        specNameAscii: { type: String }
    },
    productType: { type: mongoose.Types.ObjectId, ref: 'ProductType' },
    seoDescription: { type: String },
    seoKeyword: { type: String },
    seoTitle: { type: String },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    price:Number,
    totalOrder: { type: Number, default: Math.floor(Math.random() * 1500) + 100 },
    urlHotPicture: { type: String },
    urlPicture: { type: String },
})


productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
    next();
});


module.exports = mongoose.model('Product', productSchema, 'Product', {})