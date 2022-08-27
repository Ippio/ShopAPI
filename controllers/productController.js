const Product = require('../models/Product')
const ProductType = require('../models/ProductType')
const ProductGroup = require('../models/ProductGroup')
const Brand = require('../models/Brand')
const asyncWrapper = require('../middleware/asyncWrapper')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const upload = require('../middleware/multer-upload')

// Public Route
// Get Home  =>    GET /home

const getHome = async (req, res) => {
    const arr = ['dien-thoai', 'may-tinh-xach-tay', 'may-tinh-bang']
    const listProductType = await ProductType.find({ nameAscii: arr })
    const productType = {}
    listProductType.forEach(item => {
        switch (item.nameAscii) {
            case 'dien-thoai':
                productType.phone = (item._id)
                break;
            case 'may-tinh-bang':
                productType.ipad = (item._id)
                break;
            case 'may-tinh-xach-tay':
                productType.laptop = (item._id)
                break;
            default:
                break;
        }
    })
    const laptop = await Product.find({ productType: productType.laptop }).limit(8).sort('-totalOrder').populate('brand', 'name').populate('productType')
    const phone = await Product.find({ productType: productType.phone }).limit(8).sort('-totalOrder').populate('brand', 'name').populate('productType')
    const ipad = await Product.find({ productType: productType.ipad }).limit(8).sort('-totalOrder').populate('brand', 'name').populate('productType')
    const obj = {
        phone: await phone,
        laptop: await laptop,
        ipad: await ipad
    }
    res.status(StatusCodes.OK).json({ error: false, products: obj })
    // const 
}


// Public Route
// Get Product List  =>    GET /:productype?brand=&&page=

const getProductList = asyncWrapper(async (req, res) => {
    const { productType } = req.params
    let { sort, brand } = req.query
    const queryObject = {}
    if (sort) {
        switch (sort) {
            case "Bán chạy":
                sort = '-totalOrder'
                break;
            case "Mới nhất":
                sort = '-createdAt'
                break;
            case "Giá cao":
                sort = '-price'
                break;
            case "Giá thấp":
                sort = 'price'
                break;
            default:
                break;
        }
    }
    const type = await (ProductType.findOne({ nameAscii: productType }, '_id'))

    const page = Number(req.query.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    if (type) {

        queryObject.productType = type

        if (brand) {
            if (brand.length >= 2) {
                brand = brand.split(',')
            }
            const listBrand = await Brand.find({ nameAscii: brand }, '_id ')
            queryObject.brand = listBrand
        }

        const products = Product.find(queryObject, '', { projection: { updatedAt: 0, createdAt: 0, __v: 0 } }).populate('brand', 'name nameAscii').populate('productType').sort(`${sort}`)
        const totalProduct = await products.clone().countDocuments()
        const listProduct = await products.skip(skip).limit(limit)
        return res.status(StatusCodes.OK).json({ error: false, data: { categoryName: type.name, listProduct, totalProduct, currentPage: page } })
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

// Public Route 
// Find Product By ID   =>    POST /product/:id
const FindByID = async (req, res) => {
    const { id } = req.params
    const product = await Product.findOne({ _id: id }).populate('productType').populate('brand')
    if (!product) throw new NotFoundError(`there is no product with ${id}`)
    res.status(StatusCodes.OK).json({ error: false, product: product })
}

// Protected Route 
// Create Product   =>    POST /product
const createProduct = async (req, res) => {
    // kiểm tra sản phẩm tồn tại hay k
    const check = await Product.findOne({ name: req.body.name })
    if (check) throw new BadRequestError('Tên sản phẩm đã tồn tại')

    try {
        const image = req.file.path
        const newProduct = new Product({ ...req.body, urlPicture: image })
        newProduct.save()
        res.status(StatusCodes.CREATED).json({ error: false, newProduct: newProduct });
    } catch (error) {
        const newProduct = new Product({ ...req.body })
        newProduct.save()
        res.status(StatusCodes.CREATED).json({ error: false, newProduct: newProduct });
    }
};


// Protected Route 
// Update Product  =>    PATCH /product/:id

const updateProduct = async (req, res) => {
    const { _id } = req.body;
    try {
        const image = req.file.path
        req.body.urlPicture = image
    } catch (error) { }
    const product = await Product.findOneAndUpdate({ _id: _id }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ error: false, product });
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

const searchProduct = async (req, res) => {
    const key = req.params.key.trim()
    console.log(key)
    if(!key) throw NotFoundError('404 Not Found')
    const products = await Product.find({ name: { $regex: new RegExp('^' + key + '.*', 'i') } }).limit(8)
    if (products.length === 0) throw new BadRequestError('There is no product')
    res.status(StatusCodes.OK).json({ error: false, products: products })
}

module.exports = {
    getHome,
    getProductList,
    getProductDetail,
    FindByID,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
}