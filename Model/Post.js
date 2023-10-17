const mongoose = require("mongoose");
const Schema = mongoose;
function file(file) {
    // if (file == '') {
    //     return process.env.PHOTO_URL +'1696488346209-photo-1503443207922-dff7d543fd0e.jpg'
    // }

    return process.env.PHOTO_URL + file
}
const UserSchema = new mongoose.Schema(
    {
        file: {
            type: String,
            default: "",
            get: file,
        },
    },
);
UserSchema.set('toObject', { getters: true })
UserSchema.set('toJSON', { getters: true })
UserSchema.set('toArray',{getters:true})
const Post = mongoose.model("Post", UserSchema);
module.exports = Post;  