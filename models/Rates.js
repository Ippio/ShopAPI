const mongoose = require('mongoose')
const RatesSchema = new mongoose.Schema()
module.exports = mongoose.model('Rates',RatesSchema,'Rates')