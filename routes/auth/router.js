const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../utils");
const { loginSchema } = require("./validations");
const { login, refreshToken, getMe } = require("./controller");

router
  .route("/login")
  .post(
    validateSchema(loginSchema),
    passport.authenticate("local", { session: false }),
    login
  );

router.route("/refesh-token").post(refreshToken);

router
  .route("/profile")
  .get(passport.authenticate("jwt", { session: false }), getMe);

module.exports = router;
