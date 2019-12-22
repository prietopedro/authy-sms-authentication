const express = require("express");
const router = express.Router();
const {
  hashPassword,
  createUser,
  createAuthyUser,
  validatePhoneToken
} = require("../controllers/usercontrollers");


const createUserMw = [hashPassword, createAuthyUser];
router.route("/register").post(createUserMw, createUser);
router.route("/verify").post(validatePhoneToken);

module.exports = router;
