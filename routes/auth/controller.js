const JWT = require("jsonwebtoken");

const {
  generateToken,
  generateRefreshToken,
} = require("../../utils/jwtHelper");
const { Employee } = require("../../models");
const jwtSettings = require("../../constants/jwtSettings");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { _id, firstName, lastName, typeRole, avatar } = req.user;

      const token = generateToken({
        _id,
        firstName,
        lastName,
        typeRole,
        avatar: avatar?.avatarUrl || null,
      });
      const refreshToken = generateRefreshToken(_id);

      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      JWT.verify(refreshToken, jwtSettings.SECRET, async (err, data) => {
        if (err) {
          return res.status(401).json({
            message: "refreshToken is invalid",
          });
        } else {
          const { id } = data;

          const employee = await Employee.findOne({
            _id: id,
            isDeleted: false,
          })
            .select("-password")
            .lean();

          if (employee) {
            const {
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            } = employee;

            const token = generateToken({
              _id,
              firstName,
              lastName,
              phoneNumber,
              address,
              email,
              birthday,
              updatedAt,
            });

            return res.status(200).json({ token });
          }
          return res.sendStatus(401);
        }
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      res.status(400).json({
        statusCode: 400,
        message: "Lỗi",
      });
    }
  },


  getMe: async (req, res, next) => {
    try {
      res
        .status(200)
        .json({
          message: "Retrieve detailed employee data successfully",
          payload: req.user,
        });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res
        .status(400)
        .json({ message: "Retrieving detailed employee data failed", error });
    }
  },
};
