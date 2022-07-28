const Product = require('../models/Product')
const ProductType = require('../models/ProductType')
const ProductGroup = require('../models/ProductGroup')
const Brand = require('../models/Brand')
const asyncWrapper = require('../middleware/asyncWrapper')
const { BadRequestError, UnauthenticatedError,NotFoundError } = require('../errors')
const {StatusCodes} = require('http-status-codes')

// Public Route
// Get Home  =>    GET /home

const getHome= async(req,res)=>{
    const arr = ['dien-thoai','may-tinh-xach-tay','may-tinh-bang']
    const listProductType = await ProductType.find({nameAscii: arr},'_id')
    const phones = await Product.find({productType: listProductType[0]},'brand productType nameExt listProductGroupDetail totalOrder urlPicture ').sort('-totalOrder').populate('productType','nameAscii').limit(8)

    res.status(StatusCodes.OK).json({error:false, products: phones})
    // const 
}


// Public Route
// Get Product List  =>    GET /:productype?brand=&&page=

const getProductList = asyncWrapper(async (req, res) => {
    const { productType } = req.params
    let { sort, brand } = req.query
    const queryObject = {}
    const type = await (ProductType.findOne({ nameAscii: productType }, '_id'))

    if (type) {
        const page = Number(req.query.page) || 1
        const limit = 20
        const skip = (page - 1) * limit

        queryObject.productType = type

        if (brand) {
            if (brand.length >= 2) {
                brand = brand.split(',')
            }
            const listBrand = await Brand.find({ nameAscii: brand }, '_id ')
            queryObject.brand = listBrand
        }

        const products = Product.find(queryObject, 'brand description nameExt listProductGroupDetail totalOrder urlPicture').populate('brand', 'name').populate('listProductGroupDetail', 'price name storage')
        const totalProduct = await products.clone().countDocuments()
        const listProduct = await products.skip(skip).limit(limit)
        return res.status(StatusCodes.OK).json({ success: true, data:{categoryName:type.name,listProduct, totalProduct }})
    }
    else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Not found' })
    }
})

// Public Route
// Get Product Detail  =>    GET /:productype/:name

const getProductDetail = asyncWrapper(async (req, res) => {
    const { productType, name } = req.params
    const type = await ProductType.findOne({ nameAscii: productType }, 'listProduct')

    if (type) {
        let productGroup1 = (await ProductGroup.find({ nameAscii: name }, '', { projection: { __v: 0, _id: 0 } }).sort('price').limit(1).populate('listProductVariant', 'colorName colorImageUrl stockQuantity'))[0]
        const productGroup2 = await ProductGroup.findOne({ productNameAscii: name }, '', { projection: { __v: 0, _id: 0 } }).populate('listProductVariant', 'colorName colorImageUrl stockQuantity')
        try {
            if (productGroup1 !== undefined && type.listProduct.includes(productGroup1.productID)) {
                const productGroup = productGroup1
                const product = await Product.find({ _id: productGroup1.productID }).populate('brand', 'name').populate('listProductGroupDetail', 'name nameAscii price productNameAscii storage storageAscii').populate('productType', 'name').populate('listProductVariant')
                return res.status(200).json({ error: false, product, productGroup })
            }

        } catch (error) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Not found', type })
        }

        try {
            if (productGroup2 !== undefined && type.listProduct.includes(productGroup2.productID)) {
                const productGroup = productGroup2
                const product = await Product.find({ _id: productGroup2.productID }).populate('brand', 'name').populate('listProductGroupDetail', 'name nameAscii price productNameAscii storage storageAscii').populate('productType', 'name').populate('listProductVariant')
                return res.status(200).json({ error: false, product, productGroup })
            }
        } catch (error) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Not found 1' })
        }
        return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Not found 2' })
    }
    else {
        return res.status(StatusCodes.NOT_FOUND).json({ error: true, msg: 'Not found 3' })
    }
})

// Protected Route 
// Create Product   =>    POST /product
const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  };


// Protected Route 
// Update Product  =>    PATCH /product/:id

const updateProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
};

// Protected Route / Admin Only
// Delete Product =>    DELETE /product/:id

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    product.remove();
    res.status(StatusCodes.OK).json({ msg: 'success! product removed' });

}

module.exports = {
    getHome,
    getProductList,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
}