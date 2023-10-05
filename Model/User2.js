const mongoose = require("mongoose");
const Schema = mongoose;
function image(image) {
    if (image == '') {
        return "https://d796-122-170-44-120.ngrok-free.app/uploads/1696488346209-photo-1503443207922-dff7d543fd0e.jpg"
    }
    return 'https://d796-122-170-44-120.ngrok-free.app/uploads/' + image
}
const User2Schema = new mongoose.Schema(
    {
        first_name: { type: String, require: true },
        last_name: { type: String, require: true },
        email: { type: String, require: true },
        image: {
            type: String,
            default: "",
            get: image,
        },
    },
);
User2Schema.set('toObject', { getters: true })
User2Schema.set('toJSON', { getters: true })
const User2 = mongoose.model("User2", User2Schema);
module.exports = User2;  