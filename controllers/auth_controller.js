const md5 = require('md5');
const User = require('../models/user_model');

module.exports.login = function(req, res, next) {
  res.render('auth/login');
};

module.exports.postLogin = async function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = md5(password);

  // var user = db.get('users').find({ email: email }).value();
  var user = await User.find({ email: email });

  if(!user.length) {
    res.render('auth/login', {
      errors: [
        'User does not exist!'
      ],
      values: req.body
    });
    return;
  }

  if(user[0].password !== hashedPassword) {
    res.render('auth/login', {
      errors: [
        'Wrong password!'
      ],
      values: req.body
    });
    return;
  }

  res.cookie('userId', user[0]._id, {
    signed: true
  });
  res.redirect('/users');
};