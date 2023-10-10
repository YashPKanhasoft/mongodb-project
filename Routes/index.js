const express = require("express");
const routes = express.Router();
let UserController = require('../Controllers/UserController');
let Authorization = require('../middlware/auth');
let upload = require('../middlware/multer');


routes.post('/SignUp', upload.single("image"), UserController.SignUp);

routes.post('/Login', UserController.login);

routes.post('/VerifyOtp',UserController.VerifyOtp);

routes.post('/EditProfile', upload.single("image"), Authorization.authication, UserController.EditProfile);

routes.post('/ProductAdd', upload.single('image'), UserController.ProductAdd);

routes.post('/UserList', UserController.UserList);

routes.post('/productlist', UserController.ProductList);

routes.post('/UserDetails', Authorization.authication, UserController.LoginList);

routes.post('/AddUser',upload.single("image"),UserController.AddUser);

routes.post('/User2List',UserController.User2List);

routes.post('/EditUser', upload.single("image"),UserController.EditUser);

routes.post('/DeleteUser',UserController.DeleteUser);


module.exports = routes;