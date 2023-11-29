const { Employee } = require("../../models");
const { fuzzySearch } = require("../../utils");

module.exports = {
  createEmployee: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        typeRole,
        birthday, // Ngày sinh
        address, // Địa chỉ
      } = req.body;

      const password = "Haha@123"; // Giá trị mặc định cho password
      const avatarId = null;

      const newEmployee = new Employee({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        typeRole,
        avatarId,
        birthday: birthday ? birthday : null,
        address: address ? address : null,
      });

      const payload = await newEmployee.save();
      return res
        .status(200)
        .json({ message: "Add employee successfully", payload });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.status(400).json({ message: "Adding employee failed", error });
    }
  },

  getAllEmployee: async (req, res, next) => {
    try {
      const payload = await Employee.find({ isDeleted: false })
        .select("-password")
        .populate({
          path: "avatar",
          select: "-_id -name -imageUrls -coverImageUrl -createdAt -updatedAt",
        });
      const total = payload.length;
      return res.status(200).json({
        message: "Retrieve employees data successfully",
        total,
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Retrieving employees data failed", error });
    }
  },

  getListEmployee: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query; // 10 - 1
      const limit = pageSize || 8; // 10
      const skip = limit * (page - 1) || 0;
      let payload = await Employee.find({ isDeleted: false })
        .populate({
          path: "avatar",
          select: "-_id -name -imageUrls -coverImageUrl -createdAt -updatedAt",
        })
        .select("-password")
        .skip(skip)
        .limit(limit);

      const totalEmployee = await Employee.countDocuments(payload);
      return res.status(200).json({
        message: "Retrieve employees data successfully",
        totalEmployee,
        count: payload.length,
        payload,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Retrieving employees data failed", error });
    }
  },

  getDetailMe: async (req, res, next) => {
    try {
      const id = req.user._id;
      const payload = await Employee.findOne({
        _id: id,
        isDeleted: false,
      })
        .select("-password")
        .populate({
          path: "avatar",
          select: "-_id -name -imageUrls -coverImageUrl -createdAt -updatedAt",
        })
        .exec();
      if (!payload) {
        return res.status(400).json({ message: "No me found in data" });
      }
      return res
        .status(200)
        .json({ message: "Retrieve detailed me data successfully", payload });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Retrieving detailed me data failed", error });
    }
  },

  getDetailEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Employee.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate({
          path: "avatar",
          select: "-_id -name -imageUrls -coverImageUrl -createdAt -updatedAt",
        })
        .select("-password");
      if (!payload) {
        return res.status(400).json({ message: "No employee found in data" });
      }
      return res.status(200).json({
        message: "Retrieve detailed employee data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Retrieving detailed employee data failed", error });
    }
  },

  updateInformationEmployee: async (req, res, next) => {
    try {
      const id = req.user._id;
      const { firstName, lastName, birthday, address } = req.body;
      const payload = await Employee.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          firstName,
          lastName,
          birthday,
          address,
        },
        { new: true }
      );
      if (!payload) {
        return res.status(400).json({ message: "No employee found in data" });
      }
      return res.status(200).json({
        message: "Updated information employee data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Updating information employee data failed", error });
    }
  },

  updateRoleEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { typeRole } = req.body;
      const payload = await Employee.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { typeRole },
        { new: true }
      );
      if (!payload) {
        return res.status(400).json({ message: "No employee found in data" });
      }
      return res
        .status(200)
        .json({ message: "Updated role employee data successfully", payload });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Updating role employee data failed", error });
    }
  },

  deleteEmployee: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Employee.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (!payload) {
        return res.status(400).json({ message: "No employee found in data" });
      }
      return res
        .status(200)
        .json({ message: "Delete employee data successfully" });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Delete employee data failed", error });
    }
  },

  searchEmployee: async (req, res, next) => {
    try {
      const { keyword } = req.query;

      const conditionFind = { isDeleted: false };

      const payload = await Employee.find({
        ...conditionFind,
        $or: [
          { firstName: { $regex: fuzzySearch(keyword) } },
          { lastName: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ],
      })
        .sort({ lastName: 1 })
        .populate({
          path: "avatar",
          select: "-_id -name -imageUrls -coverImageUrl -createdAt -updatedAt",
        })
        .select("-password");

      const totalEmployee = await Employee.countDocuments(conditionFind);
      if (payload) {
        return res.status(200).json({
          message: "Search information of employees successfully",
          totalEmployee,
          count: payload.length,
          payload,
        });
      }

      return res.status(410).json({
        message: "Search information of employees not found",
      });
    } catch (err) {
      console.log("««««« error »»»»»", err);
      return res.status(404).json({
        message: "Search information of employees failed",
        error: err,
      });
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const id = req.user._id;
      const { passwordOld, newPassword, confirmPassword } = req.body;

      let employee = await Employee.findOne({
        _id: id,
        isDeleted: false,
      });

      let error = [];

      const isCorrectPassOld = await employee.isValidPass(passwordOld);
      const isCorrectPassNew = await employee.isValidPass(newPassword);

      if (!isCorrectPassOld) {
        error.push(
          "Change password information of employee password old does not match"
        );
      }

      if (isCorrectPassNew) {
        error.push(
          "Change password information of employee newPassword match passwordOld"
        );
      }

      if (newPassword !== confirmPassword) {
        error.push(
          "Change password information of employee confirmPassWord and newPassword not match"
        );
      }

      if (error.length > 0) {
        return res.status(404).json({
          message: "Change password information of employee failed",
          error: `${error}`,
        });
      }

      const updateEmployee = await Employee.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          password: newPassword,
        },
        { new: true }
      );

      if (updateEmployee) {
        return res.status(200).json({
          message: "Change password information of employee successfully",
          payload: updateEmployee,
        });
      }

      return res
        .status(410)
        .json({ message: "Change password information of employee not found" });
    } catch (err) {
      return res.send(404, {
        message: "Change password information of employee failed",
        error: err,
      });
    }
  },
};
