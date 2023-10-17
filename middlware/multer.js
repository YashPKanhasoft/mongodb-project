let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },

});

const upload = multer({
    storage: storage,
    // fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(png|jpg)$/)) { 
    //    // upload only png and jpg format
    //    return cb(new Error('Please upload a Image'))
    //  }
    // cb(undefined, true)}
});
module.exports = upload;