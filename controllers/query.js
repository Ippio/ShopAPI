const Product = require('../models/Product')
const ProductGroup = require('../models/ProductGroup')
const ProductVariant = require('../models/ProductVariant')
const Brand = require('../models/Brand')
const ProductType = require('../models/ProductType')
const User = require('../models/User')
const asynWrapper = require('../middleware/asyncWrapper')
const Order = require('../models/Order')
const Customer = require('../models/Customer')
const Review = require('../models/Review')
const moment = require('moment')

const query = asynWrapper(async (req, res) => {
    // const order= await Order.deleteMany()
    // const customer = await Customer.deleteMany()
    // const result = await Review.deleteMany()
    const today = moment().startOf('day')
    console.log(moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'));
    console.log(moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'));
    console.log(moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'));
    console.log(moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'));
    const lastWeekOrders = await User.find({
        createdAt: {
            $gte: moment().subtract(1, 'weeks').startOf('week').toDate(),
            $lte: moment().subtract(1, 'weeks').endOf('week').toDate()
        }
    })
    res.status(200).json({ msg: 'execute completed', lastWeekOrders })
})

const getAdminHome = async (req, res) => {
    const totalOrder = Order.find().countDocuments()
    const totalUser = User.find().countDocuments()
    const data = {
        totalOrder: await totalOrder,
        totalUser: await totalUser,
    }
    const today = moment().startOf('day')
    const todayOrders = await Order.find({
        createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }
    })
    let totalSales = 0
    todayOrders.forEach((order) => {
        totalSales += order.total
    })
    res.status(200).json({ error: false, data, totalSales })
}

module.exports = {
    query,
    getAdminHome
}