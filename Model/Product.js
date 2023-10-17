const mongoose = require('mongoose');
let Schema = mongoose;
let ObjectId = mongoose.Types.ObjectId
function images(images) {

   const uploadedPhotoURLs = images.map((images) => {
    return process.env.PHOTO_URL + images;

  });

  // if (uploadedPhotoURLs.length === 0) {
  //   return [process.env.PHOTO_URL + '1697009495923-default-image.jpg'];
  // }

  return uploadedPhotoURLs
}
const ProductSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.ObjectId,
      default: new ObjectId
    },
    title: { type: String },
    price: { type: String },
    description: { type: String },
    images: {
      type: Array,
      get: images,
    },
    fileinfo: {
      type: Array,
    },
  },
);
ProductSchema.set('toObject', { getters: true })
ProductSchema.set('toJSON', { getters: true })
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;