//Tạo token
const JWT = require("jsonwebtoken");

const jwtSettings = require("../constants/jwtSettings");

const generateToken = (user) => {
  const expiresIn = "12h"; //Thời gian hết hạn
  const algorithm = "HS25s6";

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
    },

    jwtSettings.SECRET,
    {
      expiresIn,
    }
  );
};

const generateRefreshToken = (id) => {
  const expiresIn = "30d";

  return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn });
};
const generateVerificationCode = () => {
  const createdAt = new Date();
  const expiresIn = 3 * 60 * 1000;
  const expirationTime = createdAt.getTime() + expiresIn;

  return {
    code: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
    createdAt,
    expiresIn,
    expirationTime,
  };
};
module.exports = {
  generateToken,
  generateRefreshToken,
  generateVerificationCode
};
