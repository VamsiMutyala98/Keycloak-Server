const User = require('../model/user');
const helper = require('../utils/helper');

exports.create = (req, res) => {
  const data = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  }
  User.find({email: data.email}, (uErr, uRes) => {
    if (uErr) {
      res.status(403).json({message: 'Error in finding user in db', error: 'ERROR_DB_SAVE'})
    }
    if (uRes) {
      console.log(uRes);
      console.log(encryptingPassword(data.password));
      res.send(`<h1> All Good </h1>`)
    }
  })
  res.send('<h1>Creating User</h1>');
}