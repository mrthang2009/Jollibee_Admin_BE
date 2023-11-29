const { Employee, Order } = require("../../models");
const { asyncForEach } = require("../../utils");

module.exports = {
  getListOrder: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 8;
      const skip = (page - 1) * limit || 0;

      let conditionFind = {
        status: "DELIVERING",
        isOnline: true,
        employeeId: null,
      };

      const results = await Order.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ shippedDate: -1, createdDate: 1 });

      const total = await Order.countDocuments(conditionFind);

      if (results)
        return res.status(200).json({
          message: "Get list information of order successfully",
          total,
          count: results.length,
          payload: results,
        });

      return res
        .status(410)
        .json({ message: "Get list information of order not found" });
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Get list information of order failed", error });
    }
  },

  getListOrderChecked: async (req, res, next) => {
    try {
      const employeeId = req.user._id;
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      let conditionFind = {
        status: "DELIVERING",
        isOnline: true,
        employeeId: employeeId,
      };

      const results = await Order.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ shippedDate: -1, createdDate: 1 });

      const total = await Order.countDocuments(conditionFind);

      if (results)
        return res.status(200).json({
          message: "Get list information of order successfully",
          total,
          count: results.length,
          payload: results,
        });

      return res
        .status(410)
        .json({ message: "Get list information of order not found" });
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Get list information of order failed", error });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const employeeId = req.user._id;

      let result = await Order.findOne({ _id: id, employeeId: employeeId });

      if (result) {
        return res.status(200).json({
          code: 200,
          message: "Get detail information of order successfully",
          payload: result,
        });
      }

      return res
        .status(410)
        .json({ message: "Get detail information of order not found" });
    } catch (err) {
      return res.status(404).json({
        code: 404,
        message: "Get detail information of order failed",
        error: err,
      });
    }
  },

  updateStatusChecked: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const employeeId = req.user._id;

      let validOrder = await Order.findOne({
        _id: id,
        employeeId: employeeId,
        isOnline: true,
        status: "DELIVERING",
      });

      if (!validOrder) {
        return res
          .status(410)
          .json({ message: "Online order not found" });
      }

      let result = await Order.findByIdAndUpdate(
        validOrder._id,
        { status },
        { new: true }
      );

      if (result) {
        return res.status(200).json({
          message: "Update status information of order successfully",
          payload: result,
        });
      }

      return res
        .status(410)
        .json({ message: "Update status information of order failed" });
    } catch (err) {
      return res.status(404).json({
        message: "Update status information of order failed",
        error: err,
      });
    }
  },

  updateChecked: async (req, res, next) => {
    try {
      const { orderList } = req.body;
      const employeeId = req.user._id;

      let validOrder = [];

      await asyncForEach(orderList, async (item) => {
        const order = await Order.findOne({
          _id: item.orderId,
          employeeId: null,
          isOnline: true,
          status: "DELIVERING",
        });
        if (!order) {
          errors.push(`Order ${item.orderId} is not found`);
        }

        return validOrder.push(order);
      });

      if (errors.length > 0) {
        return res.status(404).json({
          message: "Update checked information of order is not enough",
          error: errors,
        });
      }

      let results = [];
      await asyncForEach(validOrder, async (item) => {
        const resultOrder = await Order.findOneAndUpdate(
          { _id: item._id },
          { employeeId: employeeId },
          { new: true }
        );
        results.push(resultOrder);
      });
      if (results) {
        return res.status(200).json({
          payload: results,
          message: "Update checked information of order successfully",
        });
      }

      return res
        .status(410)
        .json({ message: "Update checked information of order not found" });
    } catch (err) {
      return res.status(404).json({
        message: "Update status information of order failed",
        error: err,
      });
    }
  },
};
