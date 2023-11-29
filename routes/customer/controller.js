const { fuzzySearch } = require("../../utils");
const { Customer, Cart } = require("../../models");

module.exports = {
  createCustomer: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        birthday, // Ngày sinh
        address, // Địa chỉ
      } = req.body;
      // const getEmailExits = Customer.findOne({ email });
      // const getPhoneExits = Customer.findOne({ phoneNumber });

      // const [foundEmail, foundPhoneNumber] = await Promise.all([
      //   getEmailExits,
      //   getPhoneExits,
      // ]);

      // const errors = [];
      // if (foundEmail) errors.push("email: already exists");
      // // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      // if (foundPhoneNumber) errors.push("phoneNumber :already exists");
      // if (errors.length > 0) {
      //   return res.status(404).json({
      //     message: "Register is not valid",
      //     error: `${errors}`,
      //   });
      // }
      const password = "Haha@123"; // Giá trị mặc định cho password
      const avatarId = null;

      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        avatarId,
        birthday: birthday ? birthday : null,
        address: address ? address : null,
      });

      const payload = await newCustomer.save();
      const customerId = payload._id;
      const newCart = new Cart({ customerId });

      newCart.save();
      return res
        .status(200)
        .json({ message: "Add customer successfully", payload });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.status(400).json({ message: "Adding customer failed", error });
    }
  },
  getAllCustomer: async (req, res, next) => {
    try {
      const payload = await Customer.find({ isDeleted: false })
        .select("-password")
        .populate("media")
        .populate("cart")
        .populate("order");
      const total = payload.length;
      return res.status(200).json({
        message: "Retrieve customers data successfully",
        total,
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res
        .status(400)
        .json({ message: "Retrieving customers data failed", error });
    }
  },

  getListCustomer: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; // 10 - 1
      const limit = pageSize || 8;
      const skip = limit * (page - 1) || 0;
      let payload = await Customer.find({ isDeleted: false })
        .populate("media")
        .populate("cart")
        .populate("order")
        .select("-password")
        .skip(skip)
        .limit(limit);
      const totalCustomer = await Customer.countDocuments(payload);
      return res.status(200).json({
        message: "Retrieve customers data successfully",
        totalCustomer,
        count: payload.length,
        payload,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Retrieving customers data failed", error });
    }
  },

  getDetailCustomer: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Customer.findOne({
        _id: id,
        isDeleted: false,
      })
        .select("-password")
        .populate("media")
        .populate("order")
        .populate("cart");
      if (!payload) {
        res.status(400).json({ message: "No customer found in data" });
      }
      res.status(200).json({
        message: "Retrieve detailed customer data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res
        .status(400)
        .json({ message: "Retrieving detailed customer data failed", error });
    }
  },

  searchCustomer: async (req, res, next) => {
    try {
      const { keyword } = req.query;

      const conditionFind = { isDeleted: false };

      const payload = await Customer.find({
        ...conditionFind,
        $or: [
          // { lastName: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ],
      })
        .select("-password")
        .populate("media")
        .populate("order")
        .sort({ lastName: 1 })
        .populate("cart");

      const totalCustomer = await Customer.countDocuments(conditionFind);
      if (payload) {
        return res.status(200).json({
          message: "Search information of customers successfully",
          totalCustomer,
          count: payload.length,
          payload,
        });
      }

      return res.status(410).json({
        message: "Search information of customers not found",
      });
    } catch (err) {
      return res.status(404).json({
        message: "Search information of customers failed",
        error: err,
      });
    }
  },
};
