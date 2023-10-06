const mongoose = require('mongoose');
let Schema = mongoose;
let ObjectId = mongoose.Types.ObjectId
function image(image) {
  if (image == '') {
    return process.env.PHOTO_URL+'1696418220293-pexels-hammad-khalid-1786433.jpg'
  }
  return process.env.PHOTO_URL + image
}
const ProductSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.ObjectId,
      default: new ObjectId
    },
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    image: {
      type: String,
      default: "",
      get: image,
    },
  },
);
ProductSchema.set('toObject', { getters: true })
ProductSchema.set('toJSON', { getters: true })
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;