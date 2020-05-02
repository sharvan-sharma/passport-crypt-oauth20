function pError(message, code){
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'processError';
    this.message = message;
    this.code = code;
  }
  
  pError.prototype.__proto__ = Error.prototype;
  
  
  // Expose constructor.
  module.exports = pError;