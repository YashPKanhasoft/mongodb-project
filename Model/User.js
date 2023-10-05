const mongoose = require("mongoose");
const Schema = mongoose;
function image(image) {
    if (image == '') {
        return 'https://d796-122-170-44-120.ngrok-free.app/uploads/1696326563265-profile-pic-dummy.png'
    }
    return 'https://d796-122-170-44-120.ngrok-free.app/uploads/' + image
}
const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        image: {
            type: String,
            default: "",
            get: image,
        },
        auth_token: { type: String, default: '' }
    },
);
UserSchema.set('toObject', { getters: true })
UserSchema.set('toJSON', { getters: true })
const User = mongoose.model("User", UserSchema);
module.exports = User;  