let User = require('../Model/User');
let ResponseHelper = require('../Respone/ResopneController');
let jwt = require('jsonwebtoken');
class Auth {

  async authication(req, res, next) {
    try {
      if ('authorization' in req.headers && req.headers.authorization !== null) {
        let token = req.headers.authorization;
        let check_token = await User.find({ auth_token: req.headers.authorization })
        if (check_token.length > 0) {
          console.log('===>', token);
          var isExpiredToken = false;
          var dateNow = new Date();
          let decodeData = jwt.verify(token, 'secretkey');
          if (decodeData.exp < dateNow.getTime()) {
            isExpiredToken = true;
            next(); 
          }
        } else {
          throw new Error('token not found');
        }
      } else {
        throw new Error('Authorization token missing');
      }
    } catch (error) {
      return ResponseHelper.error(error, res);
    }
  }
}
module.exports = new Auth(0);