const User = require('../Model/User');
let ResponseHelper = require('../Respone/ResopneController');
let UserService = require('../Services/UserService');
const jwt = require('jsonwebtoken')
class UserController {
  async SignUp(req, res) {
    try {
      let data = await UserService.SignUp(req);
      return ResponseHelper.success(data, 'sign-up successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async login(req, res) {
    try {
      let data = await UserService.login(req);
      return ResponseHelper.success(data, 'login successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async VerifyOtp(req, res) {
    try {
      let data = await UserService.VerifyOtp(req);
      return ResponseHelper.success(data, 'verify successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async ChangePassword(req, res) {
    try {
      let token = req.headers.authorization;
      let decodeData = jwt.verify(token, 'secretkey');
      let email = decodeData.data[0].email
      console.log(email);
      let data = await UserService.ChangePassword(req, email);
      return ResponseHelper.success(data, 'Change Password Successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async SentLink(req, res) {
    try {
      let data = await UserService.SentLink(req);
      return ResponseHelper.success(data, 'link send Successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async ForgetPassword(req, res) {
    try {
      let token = req.headers.authorization;
      let decodeData = jwt.verify(token, 'secretkey')
      let email = decodeData.data[0].email
      let data = await UserService.ForgetPassword(email, req);
      return ResponseHelper.success(data, 'change Password sucessfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async EditProfile(req, res) {
    try {
      let token = req.headers.authorization;
      let decodeData = jwt.verify(token, 'secretkey');
      let _id = decodeData.data[0]._id;
      let data = await UserService.EditProfile(req, _id);
      return ResponseHelper.success(data, 'updated sucessfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async UserList(req, res) {
    try {
      let data = await UserService.UserList(req);
      return ResponseHelper.success(data, 'User list', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }

  async ProductAdd(req, res) {
    try {
      let data = await UserService.ProductAdd(req);
      return ResponseHelper.success(data, 'product add successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async ProductList(req, res) {
    try {
      let data = await UserService.ProductList(req);
      return ResponseHelper.success(data, 'product-list', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async UpdateProduct(req, res) {
    try {
      let data = await UserService.UpdateProduct(req);
      return ResponseHelper.success(data, 'update product successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async DeleteProduct(req, res) {
    try {
      let data = await UserService.DeletProduct(req);
      return ResponseHelper.success(data, 'delete product successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async ProductDetils(req, res) {
    try {
      let data = await UserService.ProductDetails(req);
      return ResponseHelper.success(data, 'Product Details', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async LoginList(req, res) {
    try {
      let token = req.headers.authorization;
      let decodeData = jwt.verify(token, 'secretkey');
      let _id = decodeData.data[0]._id;
      let data = await UserService.LoginList(_id);
      let responseData = {
        status: 200,
        message: "",
        data: data,
      }
       return ResponseHelper.success(data, 'User Detail', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async CheckValidation(req, res) {
    try {
      let token = req.headers.authorization;
      let decodeData = jwt.verify(token, 'secretkey');
      let _id = decodeData.data[0]._id;
      let data = await UserService.CheckValidation(_id);
      return ResponseHelper.success(data, 'IsValidation', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async AddUser(req, res) {
    try {
      let data = await UserService.AddUser(req);
      return ResponseHelper.success(data, 'user added successfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async User2List(req, res) {
    try {
      let data = await UserService.User2List(req);
      return ResponseHelper.success(data, 'User list', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async EditUser(req, res) {
    try {
      let data = await UserService.EditUser(req);
      return ResponseHelper.success(data, 'Edit user successfully', res)
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async DeleteUser(req, res) {
    try {
      let data = await UserService.DeleteUser(req);
      return ResponseHelper.success(data, 'delete user successfully', res)
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
  async FileUpload(req, res) {
    try {
      let data = await UserService.FileUpload(req);
      return ResponseHelper.success(data, 'file uploaded sucessfully', res);
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
}
module.exports = new UserController();