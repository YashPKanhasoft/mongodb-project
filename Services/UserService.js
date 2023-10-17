let User = require("../Model/User");
let Product = require("../Model/Product");
const User2 = require('../Model/User2');
let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId
var speakeasy = require("@levminer/speakeasy");
var QRCode = require('qrcode');
const Post = require("../Model/Post");
const nodemailer = require("nodemailer");
const sendEmail = require("../middlware/email");
class UserService {

  async SignUp(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { first_name, last_name, email, password } = req.body
        let email_check = await User.find({ email: email })
        if (!email_check.length > 0) {
          const hash = bcrypt.hashSync(password, 10);
          let checkfilename = "";
          if (req.file) {
            checkfilename = req.file.filename;
          }
          let data = await User.create({ first_name: first_name, last_name: last_name, email: email, password: hash, image: checkfilename });
          if (data) {
            data.auth_token = '';
            let token = jwt.sign({ data }, 'secretkey', { expiresIn: '5day' });
            data.auth_token = token;
            console.log('==>', token);
            let update_token = await User.updateOne({ email: data.email }, { $set: { auth_token: token } })
          }
          return resolve(data);
        } else {
          const error = {
            status: 200,
            errorCode: "EMAIL_EXISTS",
            message: "This email address already in use! Please enter a different one",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async login(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { email, password } = req.body;
        var data = await User.find({ email: email });
        if (data.length > 0) {
          var x = bcrypt.compareSync(`${password}`, data[0].password);
          console.log("compare==========>", x);
          if (x) {
            if (data) {
              data[0].auth_token = '';
              let token = jwt.sign({ data }, 'secretkey', { expiresIn: '5day' });
              data[0].auth_token = token;
              console.log('==>', token);
              let update_token = await User.updateOne({ email: data[0].email }, { $set: { auth_token: token } })
            }
            let Checkenable = await User.findOne({ $and: [{ enable: true }, { email: email }] })
            if (!Checkenable) {
              var secret = speakeasy.generateSecret({ length: 20 });
              let updatesecret = await User.findOneAndUpdate({ email: data[0].email }, { $set: { secret: secret, enable: true } }, {
                new: true,
                projection: { secret: 1, email: 1, auth_token: 1 }
              })
              return resolve(updatesecret);
            } else {
              let check_enable = await User.findOne({ $and: [{ enable: true }, { email: email }] }, { enable: 1, email: 1 })
              return resolve(check_enable)
            }
          }
          else {
            const error = {
              status: 200,
              errorCode: "INCORRECT_PASSWORD",
              message: "Password is incorrect",
            };
           throw error
          }
        } else {
          const error = {
            status: 200,
            errorCode: "INVALID_EMAIL",
            message: "Please enter valid email address.",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async VerifyOtp(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { secretkey, email } = req.body
        let secrets = await User.findOne({ email: email }, { first_name: 1, last_name: 1, email: 1, image: 1, secret: 1, auth_token: 1 })

        let verify = speakeasy.totp.verify({
          secret: secrets.secret.base32,
          encoding: "base32",
          token: secretkey,
        })
        console.log("verify=====>", verify);
        if (verify == false) {
          const error = {
            status: 200,
            errorCode: "INVALID_OTP",
            message: "inavild otp",
          };
          throw error
        } else {
          return resolve(secrets)
        }

      } catch (error) {
        return reject(error);
      }
    })
  }
  async ChangePassword(req, email) {
    return new Promise(async (resolve, reject) => {
      try {
        let { password, Newpassword, ConfirmNewpassword } = req.body
        console.log(req.body);
        var data = await User.findOne({ email: email })
        if (data) {
          var x = bcrypt.compareSync(`${password}`, data.password)
          if (x) {
            if (password === Newpassword) {
              const error = {
                status: 200,
                errorCode: "PASSWORD_DIFFERENT",
                message: "Password must be differnet than Old Password",
              };
              throw error
            } else if (Newpassword === ConfirmNewpassword) {
              ConfirmNewpassword = await bcrypt.hashSync(Newpassword, 10)
              var upadte = await User.findOneAndUpdate({ email: email }, { $set: { password: ConfirmNewpassword } })
              return resolve()
            }
            else {
              const error = {
                status: 200,
                errorCode: "PASSWORD_NOT_MATCH",
                message: "ConfirmNewpassword and NewPassword is not match",
              };
              throw error
            }
          } else {
            const error = {
              status: 200,
              errorCode: "INCORRECT_PASSWORD",
              message: "Password is incorrect",
            };
           throw error
          }
        } else {
          const error = {
            status: 200,
            errorCode: "INVALID_EMAIL",
            message: "Please enter valid email address.",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async SentLink(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { email } = req.body;
        const data = await User.find({ email: email });
        console.log(data);
        if (data.length > 0) {
          data[0].auth_token = '';
          let token = jwt.sign({ data }, 'secretkey', { expiresIn: '5day' });
          data[0].auth_token = token;
          console.log('==>', token);
          let update_token = await User.updateOne({ email: data[0].email }, { $set: { auth_token: token } })
          const link = `<a href = http://localhost:3000/forgetPassword?${token} >click here</a>`;

          let sendmail = await sendEmail(data[0].email, "Password reset", link);
          return resolve({ sendmail, token });
        } else {
          const error = {
            status: 200,
            errorCode: "INVALID_EMAIL",
            message: "Please enter valid email address.",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async ForgetPassword(email, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { password } = req.body
        const hash = bcrypt.hashSync(password, 10);
        let checkupadte = await User.findOneAndUpdate({ email: email }, { $set: { password: hash } });
        return resolve();
      } catch (error) {
        return reject(error);
      }
    })
  }
  async EditProfile(req, _id) {
    return new Promise(async (reslove, reject) => {
      try {
        let { first_name, last_name, email } = req.body
        let checkfilename = "";
        if (req.file) {
          checkfilename = req.file.filename;
        }
        let check_id = await User.findOne({ _id: _id })
        if (check_id) {
          let data = await User.findByIdAndUpdate({ _id: _id }, { $set: { first_name: first_name, last_name: last_name, email: email, image: checkfilename } }, { returnDocument: "after" });
          return reslove(data);
        } else {
          const error = {
            status: 200,
            errorCode: "INVALID_Id",
            message: "Please enter valid ID.",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async UserList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let limit = req.query.limit || 1;
        let page = req.query.page || 1;
        if (typeof page == undefined) {
          data = [];
        }
        const sortDirection = req.query.sort || 'asc';
        let sortOrder = 1;
        if (sortDirection === 'desc') {
          sortOrder = -1;
        }
        const totalCount = await User.count();
        const totalPages = Math.ceil(totalCount / limit);
        var searching = req.query.search.trim();

        let data = await User.find({ $or: [{ first_name: { $regex: searching } }, { last_name: { $regex: searching } }] }, { first_name: 1, last_name: 1, image: 1 }).sort({ first_name: sortOrder, last_name: sortOrder }).limit(limit).skip((page - 1) * limit);
        let result = {
          data,
          page,
          totalPages,
          totalCount
        }
        return resolve(result);
      } catch (error) {
        return reject(error)
      }
    })
  }

  async ProductAdd(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { title, price, description, image } = req.body
        const uploadedPhotoNames = req.files.map((file) => file.filename);
        const photo = new Product({ image: uploadedPhotoNames });
        let checkfilename = "";
        if (req.file) {
          checkfilename = req.file.filename;
        }
        const info = []
        for (var i = 0; i < req.files.length; i++) {

          const filename = req.files[i].filename;
          const mimeType = req.files[i].mimetype
          const filesize = req.files[i].size + " bytes"
          let fileinfo = {
            filename, mimeType, filesize
          }
          info.push(fileinfo);
        }
        let data = await Product.create({ title: title, price: price, description: description, images: uploadedPhotoNames, fileinfo: info });
        data.save(); return resolve(data);
      } catch (error) {
        return reject(error);
      }
    })
  }
  async ProductList(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let limit = req.query.limit || 5;
        let page = parseInt(req.query.page) || 1;
        page += 1
        const cursor = req.query.cursor || null;
        const query = cursor ? { product_id: { $gt: cursor } } : {};

        let data = await Product.find(query, {}, { description: 1, title: 1, images: 1, price: 1 },).limit(limit).skip((page - 1) * limit);
        for (let i = 0; i < data.length; i++) {
          let images = [];
          for (let x = 0; x < data[i].fileinfo.length; x++) {
            if (data[i].fileinfo[x].mimeType == "application/zip") {
              images.push('1697197651779-pdflogo.png')
            } else if (data[i].fileinfo[x].mimeType == "image/jpeg" || data[i].fileinfo[x].mimeType == "image/avif" || data[i].fileinfo[x].mimeType == "video/mp4" || data[i].fileinfo[x].mimeType == "image/png") {
              images.push(data[i].fileinfo[x].filename)
            }
          }
          data[i].images = images
        }
        const newCursor = data.length > 0 ? data[data.length - 1].product_id : null;
        if (newCursor == null) {
          page = null
        }
        return resolve({ data, cursor: newCursor, nextpage: page });
      } catch (error) {
        return reject(error);
      }
    })
  }
  async UpdateProduct(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { _id, title, price, description } = req.body
        const uploadedPhotoNames = req.files.map((file) => file.filename);
        const photo = new Product({ image: uploadedPhotoNames });
        const info = []

        for (var i = 0; i < req.files.length; i++) {

          const filename = req.files[i].filename;
          const mimeType = req.files[i].mimetype
          const filesize = req.files[i].size + " bytes"
          let fileinfo = {
            filename, mimeType, filesize
          }
          info.push(fileinfo);
        }
        var detail = await Product.findOne({
          _id: _id,
        });
        if (detail) {

          const updateData = { title: title, price: price, description: description };
          if (req.files && req.files.length > 0) {
            updateData.images = uploadedPhotoNames;
            updateData.fileinfo = info
          }
          let data = await Product.findByIdAndUpdate({ _id: _id }, { $set: updateData }, { returnDocument: 'after' });

          return resolve(data);
        }

      } catch (error) {
        return reject(error);
      }
    })
  }
  async DeletProduct(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { _id } = req.body
        let data = await Product.deleteOne({ _id: _id })
        return resolve();
      } catch (error) {
        return reject(error);
      }
    })
  }
  async ProductDetails(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { _id } = req.body
        let data = await Product.findOne({ _id: _id });
        if(data){
          return resolve(data);
        }else{
          const error = {
            status: 200,
            errorCode: "INVALID_Id",
            message: "Please enter valid ID.",
          };
          console.log(error)
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async LoginList(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await User.find({ _id: _id })
        return resolve(data[0]);
      } catch (error) {
        return reject(error)
      }
    })
  }
  async CheckValidation(_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await User.findOneAndUpdate({ _id: _id }, { $set: { isvalidation: true } }, {
          new: true,
          projection: { isvalidation: 1 }
        })
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    })
  }
  async AddUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { first_name, last_name, email } = req.body
        let checkfilename = "";
        if (req.file) {
          checkfilename = req.file.filename;
        }
        let Checkmail = await User2.findOne({ email: email })
        if (!Checkmail) {
          let data = await User2.create({ first_name: first_name, last_name: last_name, email: email, image: checkfilename })
          data.save();
          return resolve(data);
        } else {
          const error = {
            status: 200,
            errorCode: "EMAIL_EXISTS",
            message: "This email address already in use! Please enter a different one",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async User2List(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let limit = req.query.limit || 5;
        let page = req.query.page || 1;
        if (typeof page == undefined) {
          data = [];
        }
        const sortDirection = req.query.sort || 'asc';
        let sortOrder = 1;
        const sortField = req.query.column || 'first_name';
        if (sortDirection === 'desc') {
          sortOrder = -1;
        }
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;
        const totalCount = await User2.count();
        const totalPages = Math.ceil(totalCount / limit);
        var search = req.query.search.trim();
        if (search == "null" || !search) {
          search = "";
        }
        let data = await User2.find({ $or: [{ first_name: { $regex: search } }, { last_name: { $regex: search } }, { email: { $regex: search } }] }, { first_name: 1, last_name: 1, image: 1, email: 1 }).sort(sortOptions).limit(limit).skip((page - 1) * limit);

        let result = {
          data,
          page,
          totalPages,
          totalCount
        }
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    })
  }
  async EditUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { _id, first_name, last_name, email } = req.body
        let checkfilename = "";
        if (req.file) {
          checkfilename = req.file.filename;
        }

        let email_check = await User2.find({ email: email })
        if (!email_check.length > 0) {
          let data = await User2.findByIdAndUpdate({ _id: _id }, { $set: { first_name: first_name, last_name: last_name, email: email, image: checkfilename } }, { returnDocument: "after" });
          return resolve(data);
        }
        let data = await User2.findOneAndUpdate({ $and: [{ _id: _id }, { email: email }] }, { $set: { first_name: first_name, last_name: last_name, email: email, image: checkfilename } }, { returnDocument: "after" });
        if (data) {
          return resolve(data);
        }
        else {
          const error = {
            status: 200,
            errorCode: "EMAIL_EXISTS",
            message: "This email address already in use! Please enter a different one",
          };
          throw error
        }
      } catch (error) {
        return reject(error);
      }
    })
  }
  async DeleteUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { _id } = req.body
        let data = await User2.deleteOne({ _id: _id });
        let multiple = await User2.deleteMany({ _id: { $in: _id } })
        return resolve();
      } catch (error) {
        return reject(error);
      }
    })
  }
  async FileUpload(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let checkfilename = "";
        if (req.file) {
          checkfilename = req.file.filename;
        }
        let data = await Post.create({ file: checkfilename })
        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    })
  }
}

module.exports = new UserService();
