let User = require("../Model/User");
let Product = require("../Model/Product");
const User2 = require('../Model/User2');
let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId

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
                    let error = { message: "EmailId is already exits" }
                    return reject(error);
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
                        return resolve(data[0]);
                    }
                    else {
                        let error = Error('Please Enter Valid password.');
                        error.code = 400;
                        reject(error)
                    }
                } else {
                    let error = Error('invaild email');
                    return reject(error);
                }
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
                    let error = Error("invaild id");
                    return reject(error);
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
                console.log("limit", limit)
                let page = req.query.page || 1;
                console.log("page", page);
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
                console.log("total", totalCount);
                var searching = req.query.search.trim();
                console.log(searching);

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
                let checkfilename = "";
                if (req.file) {
                    checkfilename = req.file.filename;
                }
                let data = await Product.create({ title: title, price: price, description: description, image: checkfilename });
                data.save();
                return resolve(data);
            } catch (error) {
                return reject(error);
            }
        })
    }
    async ProductList(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let limit = 5;
                let page = req.query.page;
                if (typeof page == undefined) {
                    data = [];
                }
                let data = await Product.find({}, { description: 1, title: 1, image: 1, price: 1 }).limit(limit).skip((page - 1) * limit);
                return resolve(data);
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
                    let error = { message: "EmailId Already Exits." }
                    return reject(error);
                }

            } catch (error) {
                return reject(error);
            }
        })
    }
    async User2List(req) {
        return new Promise(async (resolve, reject) => {
            try {
                let limit = req.query.limit || 1;
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
                var searching = req.query.search.trim();

                let data = await User2.find({ $or: [{ first_name: { $regex: searching } }, { last_name: { $regex: searching } }] }, { first_name: 1, last_name: 1, image: 1, email: 1 }).sort(sortOptions).limit(limit).skip((page - 1) * limit);
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
                let check_id = await User2.findOne({ _id: _id })
                if (check_id) {
                    let data = await User2.findByIdAndUpdate({ _id: _id }, { $set: { first_name: first_name, last_name: last_name, email: email, image: checkfilename } }, { returnDocument: "after" });
                    return resolve(data);
                } else {
                    let error = Error("Invaild Id");
                    return reject(error);
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
                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }
}

module.exports = new UserService();