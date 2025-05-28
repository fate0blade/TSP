const express = require("express");
const {
  registerUser,
  loginUser,
  forgetPassword,
  logoutUser,
  verifyUser,
} = require("../controllers/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPassword);

router.post("/logout", logoutUser);
router.get("/verify", auth(), verifyUser);

module.exports = router;
