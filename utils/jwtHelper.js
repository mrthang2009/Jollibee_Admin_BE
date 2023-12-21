//Tạo token
const JWT = require('jsonwebtoken');

const jwtSettings = require('../constants/jwtSettings');

const generateToken = (user) => {
  const expiresIn = '12h'; //Thời gian hết hạn
  const algorithm = 'HS25s6';

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
      // email: user.email,
      // name: user.firstName,
      // algorithm,
    },

    jwtSettings.SECRET,
    {
      expiresIn,
    },
  )
};

const generateRefreshToken = (id) => {
  const expiresIn = '30d';

  return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn })
};

module.exports = {
  generateToken,
  generateRefreshToken,
};