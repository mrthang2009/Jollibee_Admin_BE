const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../utils");
const { loginSchema, forgotSchema, sendCodeSchema } = require("./validations");
const {
  login,
  refreshToken,
  sendCode,
  forgotPassword,
  getMe,
} = require("./controller");

router
  .route("/login")
  .post(
    validateSchema(loginSchema),
    passport.authenticate("local", { session: false }),
    login
  );
router
  .route("/forgot-password")
  .post(validateSchema(forgotSchema), forgotPassword);

router.route("/refesh-token").post(refreshToken);
router.route("/send-code").post(validateSchema(sendCodeSchema), sendCode);

router
  .route("/profile")
  .get(passport.authenticate("jwt", { session: false }), getMe);

module.exports = router;
