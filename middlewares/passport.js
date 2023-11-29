const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;

const jwtSettings = require("../constants/jwtSettings");
const { Employee } = require("../models");

const VerifyTokenEmployee = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
    secretOrKey: jwtSettings.SECRET,
  },
  async (payload, done) => {
    try {
      const user = await Employee.findOne({
        _id: payload._id,
        isDeleted: false,
      }).select("-password");

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const VerifyAccountEmployee = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await Employee.findOne({
        isDeleted: false,
        email,
      }).populate("avatar");

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      user.password = undefined;

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const ConfigBasicEmployee = new BasicStrategy(async function (
  username,
  password,
  done
) {
  try {
    const user = await Employee.findOne({ email: username, isDeleted: false });

    if (!user) return done(null, false);

    const isCorrectPass = await user.isValidPass(password);

    if (!isCorrectPass) return done(null, false);

    return done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = {
  VerifyTokenEmployee,
  VerifyAccountEmployee,
  ConfigBasicEmployee,
};
