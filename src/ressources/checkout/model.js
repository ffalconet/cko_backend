const mongoose = require('mongoose');


const instrumentSchema = mongoose.Schema({
    buyerEmail: String,
    scheme: String,
    sourceId: String,
    bin: String,
    last4: String,
    expiryMonth: String,
    expiryYear: String,
}, {
	timestamps: true,
});


module.exports = mongoose.model('instrument', instrumentSchema);