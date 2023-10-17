const express = require("express");
const routes = express.Router();
let UserController = require('../Controllers/UserController');
let Authorization = require('../middlware/auth');
let upload = require('../middlware/multer');
const fileupload = require("../middlware/Fileupload");


routes.post('/SignUp', upload.single("image"), UserController.SignUp);

routes.post('/Login', UserController.login);

routes.post('/VerifyOtp', UserController.VerifyOtp);

routes.post('/ChangePassword',Authorization.authication,UserController.ChangePassword);

routes.post('/SendLink',UserController.SentLink);

routes.post('/ForgetPassword',Authorization.authication,UserController.ForgetPassword);

routes.post('/EditProfile', upload.single("image"), Authorization.authication, UserController.EditProfile);

routes.post('/ProductAdd', upload.array("images", 5), UserController.ProductAdd);

routes.post('/UserList', UserController.UserList);

routes.post('/productlist', UserController.ProductList);

routes.post('/EditProduct', upload.array("images", 5), UserController.UpdateProduct);

routes.post('/Deleteproduct', UserController.DeleteProduct);

routes.post('/ProductDetails', UserController.ProductDetils);

routes.post('/UserDetails', Authorization.authication, UserController.LoginList);

routes.post('/validation',Authorization.authication, UserController.CheckValidation)

routes.post('/AddUser', upload.single("image"), UserController.AddUser);

routes.post('/User2List', UserController.User2List);

routes.post('/EditUser', upload.single("image"), UserController.EditUser);

routes.post('/DeleteUser', UserController.DeleteUser);

routes.post('/FileUpload', fileupload.single("file"), UserController.FileUpload);

module.exports = routes;