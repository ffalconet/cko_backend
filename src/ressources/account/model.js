const mongoose = require('mongoose');


const merchantConfigSchema = mongoose.Schema({
    name: String,
    logoImage: String,
    productImage: String,
    bgImage: String,
    primaryColor: String,
    secondaryColor: String,
    thirdColor: String,
    checkColor: String,
    brand: String,
    productName: String,
    productDesc: String,
    productPrice: String,
    discount: String,
    buyerEmail: String,
    googlePayActive: { type: Boolean, default: true },
    applePayActive: { type: Boolean, default: true },
    paypalActive: { type: Boolean, default: true },
    almaActive: { type: Boolean, default: true }
}, {
	timestamps: true,
});


module.exports = mongoose.model('merchant-config', merchantConfigSchema);