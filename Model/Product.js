const mongoose = require('mongoose');
let Schema = mongoose;
let ObjectId = mongoose.Types.ObjectId
function image(image) {
  if (image == '') {
    return 'https://d796-122-170-44-120.ngrok-free.app/uploads/1696326563265-profile-pic-dummy.png'
  }
  return 'https://d796-122-170-44-120.ngrok-free.app/uploads/' + image
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