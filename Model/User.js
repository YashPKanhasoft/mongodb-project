const mongoose = require("mongoose");
const Schema = mongoose;
function image(image) {
    if (image == '') {
        return process.env.PHOTO_URL +'1696488346209-photo-1503443207922-dff7d543fd0e.jpg'
    }
    return process.env.PHOTO_URL + image
}
const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true,unique: true },
        password: { type: String, required: true },
        image: {
            type: String,
            default: "",
            get: image,
        },
        secret:{
            ascii:String,
            hex:String,
            base32:String,
            otpauth_url:String
        },
        auth_token: { type: String, default: '' }
    },
);
UserSchema.set('toObject', { getters: true })
UserSchema.set('toJSON', { getters: true })
const User = mongoose.model("User", UserSchema);
module.exports = User;  