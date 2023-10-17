class ResponseHelper {
    async success(data, message, res) {
      let responseData = {
        status: 200,
        message: message,
        data: data,
      }
      res.writeHead(responseData.status, { 'Content-Type': 'application/json' })
      res.write(JSON.stringify(responseData))
      res.end();
    }
    async error(error, res) {
      let errorCode = 200;
      let Error = error;
      console.log('message ====>',error);
      res.writeHead(errorCode, { 'Content-Type': 'application/json' })
      res.write(JSON.stringify({ status: errorCode,error:Error }))
      res.end();
    }
  }
  module.exports = new ResponseHelper();