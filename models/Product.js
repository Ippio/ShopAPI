const mongoose = require('mongoose')

// const brandSchema = new mongoose.Schema({
//     type:Object,
//     name:String,
//     nameAscii:String,
// })

// const productTypeSchema = new mongoose.Schema({
//     type:Object,
//     name:String,
//     nameAscii:String,
// })

const listAttrDetailShort = new mongoose.Schema({
    attributeName:String,
    displayOrder:Number,
    value:String
},{_id:false})

const productSchema = new mongoose.Schema({
    // attachedAccessories: String,
    name:  String ,
    nameAscii:  String,
    nameExt:  String ,
    productNameAscii: String,
    productType:{type: mongoose.Types.ObjectId,ref: 'ProductType'},
    brand: {type: mongoose.Types.ObjectId,ref: 'Brand'},
    createBy: String,
    description: String,
    details: String,
    listAttrDetailShort: [listAttrDetailShort],
    // listProductGroupDetail: [{ type: mongoose.Types.ObjectId, ref: 'ProductGroup' }],
    listProductVariant: [{ type: mongoose.Types.ObjectId, ref: 'ProductVariant' }],
    isComingSoon: { type: Boolean ,default: false},
    isHot:{ type: Boolean ,default: false},
    isShow : { type: Boolean ,default: true},
    preOrderDateEnd: String,
    preOrderDateStart: String,
    // productAttributes: {
    //     type: Array,
    //     attributeID: { type: Number },
    //     attributeName: { type: String },
    //     groupName: { type: String },
    //     specID: { type: Number },
    //     specName: { type: Number },
    //     specNameAscii: { type: String }
    // },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    quantity: { type: Number, default: Math.floor(Math.random() * 100) + 10 },
    price:Number,
    status:{
        type:String,
        default:'Đang bán'
    },
    totalOrder: { type: Number, default: Math.floor(Math.random() * 1500) + 100 },
    urlPicture: String,
},{timestamps:true})


// productSchema.virtual('reviews', {
//     ref: 'ProductGroup',
//     localField: '_id',
//     foreignField: 'productID',
//     justOne: true,
// });


productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
    next();
});


module.exports = mongoose.model('Product', productSchema, 'Product', {})