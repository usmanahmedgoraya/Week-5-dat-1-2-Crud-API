const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: [
        {
            url:
                { type: String, required: true },
            public_id:
                { type: String, required: true }
        }
    ],
    price: { type: Number, required: true },
    category: { type: String, required: true },
    features: { type: [String], required: true }
})

module.exports = mongoose.model('Products', productSchema)