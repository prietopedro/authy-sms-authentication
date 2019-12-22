const authy = require("authy")(process.env.AUTHY_API_KEY);
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");

exports.hashPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(401).json({
      status: "Failed",
      error: "Missing Password"
    });
  }
  const hash = bcrypt.hashSync(password, 8);
  req.body.password = hash;
  next();
};

exports.createAuthyUser = (req, res, next) => {
  authy.register_user(
    req.body.email,
    req.body.phone,
    false,
    (err, authyRes) => {
      if (err) {
        return res.status(401).json({
          status: "failed",
          error: err
        });
      } else {
        req.body.authy_id = authyRes.user.id;
        next();
      }
    }
  );
};

exports.createUser = async (req, res) => {
  try {
    User.create(req.body, (error, user) => {
      if (error) {
        return res.status(401).json({
          status: "failed",
          error
        });
      }
      authy.request_sms(req.body.authy_id, function(err, res) {
        if (err) {
          console.log(err);
          return;
        }
      });
      return res.status(201).json({
        status: "success",
        user
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error
    });
  }
};

exports.validatePhoneToken = (req, res) => {
  const { token, authy_id, __id } = req.body;
  if (!token || !authy_id) {
    return res.status(401).json({
      status: "failed",
      error: "Missing token or authy_id"
    });
  }
  authy.verify(authy_id, token, function(err, resA) {
    if (err) {
      return res.status(400).json({
        status: "failed",
        error: err
      });
    }
    req.session = __id;
    res.status(200).json({
      status: "success"
    })
  });
};

exports.login = async (req,res) => {
  if(!req.phone || req.phone.length !== 9){
    return res.status(401).json({
      status: "failed",
      error: "Incorrect phone number"
    });
  }
  const user = await User.findByPhone(req)
  authy.request_sms(req.body.authy_id, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    return res.status(200).json({
      status: "success",
      user,
    });
  });

}
