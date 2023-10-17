let User = require('../Model/User');
let ResponseHelper = require('../Respone/ResopneController');
let {reject} = require('bluebird')
let jwt = require('jsonwebtoken');
class Auth {
  async authication(req, res, next) {
    try {
      if ('authorization' in req.headers && req.headers.authorization !== null) {
        let token = req.headers.authorization;
        let check_token = await User.findOne({ auth_token: req.headers.authorization })
        if (check_token) {
          console.log('===>', token);
          var isExpiredToken = false;
          var dateNow = new Date();
          let decodeData = jwt.verify(token, 'secretkey');
          if (decodeData.exp < dateNow.getTime()) {
            isExpiredToken = true;
            next();
          }
        } else {
          
          const error = {
            status: 200,
            errorCode: "ERR-AUTH-001",
            message: "UNAUTHORIZED",
          };
          throw error
        }
      } else {
        const error = {
          status: 401,
          errorCode: "TOKEN_REQUIRED",
          message: "Authorize token required",
        };
      throw error
      }
    } catch (error) {
      
      return ResponseHelper.error(error, res);
    }
  }
}
module.exports = new Auth(0);