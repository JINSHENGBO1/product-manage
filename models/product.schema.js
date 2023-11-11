const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
   title: String,
   price: Number,
   stock: Number,
   image: String
}, {
    timestamps: true
});

module.exports = {
    ProductSchema
}