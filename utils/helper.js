const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * @function {encrypting password}
 * @param {string} password 
 * @returns hashpassword
 */
exports.encryptingPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

/**
 * @function {checkingEncryptionPassword}
 * @param {string} password 
 * @param {string} hashPassword 
 * @returns boolean
 */
exports.checkingEncryptionPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
}

exports.parseJWT = (token) => {
  const base64Url = token.split(".")[1];
  var decodedValue = JSON.parse(window.atob(base64Url));

  return decodedValue;
};

exports.auth = (req, res, next) => {
  const token = req?.headers?.authorization || '';
  try {
    if (token) {
      const decodedToken = jwt.decode(token);
      if (Date.now() >= decodedToken?.exp * 1000) {
        next(new AppError('Token is expired! Please Login', 401));
      } else {
        next();
      }
    } else {
      next(new AppError('Authorization token is required', 400));
    }
  } catch (error) {
    console.error(error);
    next(new AppError('Token is expired! Please Login', 401));
  }
}