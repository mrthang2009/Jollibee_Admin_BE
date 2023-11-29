const { Order, Customer, Employee, Product } = require("../../models");
const { asyncForEach } = require("../../utils");
const moment = require("moment");
module.exports = {
  createOrder: async function (req, res, next) {
    try {
      const { customerId, productList } = req.body;

      const errors = [];
      let customerOder = null;

      if (customerId) {
        const customer = await Customer.findOne({
          _id: customerId,
          isDeleted: false,
        });
        if (!customer) {
          return res.status(400).json({
            message: "No customer found with the provided customerId",
          });
        }
        customerOder = customerId;
      }

      let finalProductList = [];

      await asyncForEach(productList, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
        }).populate("media");
        if (!product) {
          errors.push(
            `No product ${item.productId} - ${product.name} found in data`
          );
        } else {
          if (product.stock < item.quantity)
            errors.push(
              `Số lượng sản phẩm ${product.name} không khả dụng`
            );
        }

        finalProductList.push({
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          discount: product.discount,
          imageProduct: product.media.coverImageUrl,
        });
      });

      if (errors.length > 0) {
        return res.status(400).json({ message: "Failed", errors });
      }
      const newOrder = new Order({
        customerId: customerOder,
        employeeId: req.user._id,
        isOnline: false,
        productList: finalProductList,
        status: "COMPLETED",
        totalFee: 0,
      });

      let payload = await newOrder.save();

      //Duyệt qua danh sách sản phẩm để cập nhật tồn kho
      await asyncForEach(payload.productList, async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      });
      return res
        .status(200)
        .json({ message: "Add order successfully", payload });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(400).json({ message: "Adding order failed", err });
    }
  },

  getAllOrder: async (req, res, next) => {
    try {
      let payload = await Order.find().sort({ createdDate: -1 });
      const totalOrder = await Order.countDocuments(payload);
      return res.status(200).json({
        message: "Retrieve orders data successfully",
        totalOrder,
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Retrieving orders data failed", error });
    }
  },

  getOrdersByYear: async (req, res, next) => {
    try {
      const { year } = req.query;
  
      const startOfYear = moment(`${year}-01-01`).startOf("year");
      const endOfYear = moment(startOfYear).endOf("year");
  
      const orders = await Order.find({
        createdDate: {
          $gte: startOfYear.toDate(),
          $lte: endOfYear.toDate(),
        },
      }).sort({ createdDate: -1 });
  
      return res.status(200).json({
        message: `Retrieve orders for ${startOfYear.format("YYYY")} successfully`,
        count: orders.length,
        payload: orders,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({
        message: "Error retrieving orders by year",
        error,
      });
    }
  },

  getListOrder: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 8;
      const skip = limit * (page - 1) || 0;
      let payload = await Order.find()
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrder = await Order.countDocuments(payload);
      return res.status(200).json({
        message: "Retrieve orders data successfully",
        totalOrder,
        count: payload.length,
        payload,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Retrieving orders data failed", error });
    }
  },

  getListPendingOrder: async (req, res, next) => {
    try {
      const { page, pageSize, status } = req.query;
      const limit = pageSize || 8;
      const skip = limit * (page - 1) || 0;
      let payload = await Order.find({ isOnline: true, status: status })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrder = await Order.countDocuments({
        isOnline: true,
        status: status,
      });
      return res.status(200).json({
        message: "Retrieve orders data successfully",
        totalOrder,
        count: payload.length,
        payload,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Retrieving orders data failed", error });
    }
  },
  getOrdersMeByMonth: async (req, res, next) => {
    try {
      const { year, month } = req.query;
  
      // Xác định khoảng thời gian từ đầu đến cuối của tháng
      const startOfMonth = moment(`${year}-${month}-01`).startOf("month");
      const endOfMonth = moment(startOfMonth).endOf("month");
  
      const orders = await Order.find({
        createdDate: {
          $gte: startOfMonth.toDate(),
          $lte: endOfMonth.toDate(),
        },
        employeeId: req.user._id, // Lọc theo id của nhân viên đang đăng nhập
      }).sort({ createdDate: -1 });
  
      return res.status(200).json({
        message: `Retrieve orders for ${startOfMonth.format("MMMM YYYY")} successfully`,
        count: orders.length,
        payload: orders,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({
        message: "Error retrieving orders by month",
        error,
      });
    }
  },
  
  getListOrderMe: async (req, res, next) => {
    try {
      const id = req.user._id;
      const { page, pageSize } = req.query;
      const limit = pageSize || 8;
      const skip = limit * (page - 1) || 0;
      let payload = await Order.find({ employeeId: id })
        .sort({ createdDate: -1 })
        .populate(
          "customer",
          " -password -countCancellations -isDeleted -createdAt -updatedAt -birthday -districtCode -provinceCode -provinceCode -_id -id"
        )
        .select("-createdAt")
        .skip(skip)
        .limit(limit);

      const totalOrder = await Order.countDocuments({ employeeId: id });
      return res.status(200).json({
        message: "Retrieve orders data successfully",
        totalOrder,
        count: payload.length,
        payload,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Retrieving orders data failed", error });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      let payload = await Order.findById(id)
        .populate(
          "customer",
          " -password -countCancellations -isDeleted -createdAt -updatedAt -birthday -districtCode -provinceCode -provinceCode -_id -id"
        )
        .populate(
          "employee",
          " -password -_id -isDeleted -createdAt -updatedAt -birthday -address -email -id"
        )
        .select("-createdAt");
      if (!payload) {
        return res.status(400).json({ message: "No order found in data" });
      }
      return res.status(200).json({
        message: "Retrieve detailed order data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Retrieving detailed order data failed", error });
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { newStatus } = req.body;

      let found = await Order.findOne({
        _id: id,
        isOnline: true,
      });
      if (!found) {
        return res
          .status(400)
          .json({ message: "No online order found in data" });
      }

      const payload = await Order.findByIdAndUpdate(
        found._id,
        { status: newStatus },
        { new: true }
      );
      return res.status(200).json({
        message: "Update online order status data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Update online order status data failed", error });
    }
  },

  updateEmployeeId: async (req, res, next) => {
    try {
      const { id } = req.params;
      const employeeId = req.user._id;
      let found = await Order.findOne({
        _id: id,
        isOnline: true,
        employeeId: null,
        status: "PREPARED",
      });
      if (!found) {
        return res
          .status(400)
          .json({ message: "No online order found in data" });
      }
      const payload = await Order.findByIdAndUpdate(
        found._id,
        { employeeId: employeeId, status: "DELIVERING" },
        { new: true }
      );
      return res.status(200).json({
        message: "Update online order status data successfully",
        payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res
        .status(400)
        .json({ message: "Update online order status data failed", error });
    }
  },

  filterOrder: async (req, res, next) => {
    try {
      const { id, status, typeOrder, startDate, paymentType, endDate } =
        req.query;

      let condition = {};

      if (id) {
        condition._id = id;
      }

      if (typeOrder) {
        condition.isOnline = typeOrder;
      }

      if (status) {
        condition.status = status;
      }

      if (paymentType) {
        condition.paymentType = paymentType;
      }

      if (startDate && endDate) {
        const startDateTime = new Date(startDate);
        startDateTime.setUTCHours(0, 0, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: startDateTime, $lte: endDateTime };
      } else if (startDate) {
        // Nếu chỉ có startDate, lấy đơn hàng từ startDate đến ngày hiện tại
        const startDateTime = new Date(startDate);
        startDateTime.setUTCHours(0, 0, 0, 0);

        const currentDate = new Date();
        currentDate.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: startDateTime, $lte: currentDate };
      } else if (endDate) {
        // Nếu chỉ có endDate, lấy đơn hàng từ ngày bắt đầu đến endDate
        const currentDate = new Date();
        currentDate.setUTCHours(23, 59, 59, 999);

        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: currentDate, $lte: endDateTime };
      }

      const filterOrder = await Order.find(condition).sort({ createdDate: -1 });
      const totalOrder = await Order.countDocuments(filterOrder);

      return res.status(200).json({
        message: "Filter Order successfully",
        total: totalOrder,
        count: filterOrder.length,
        payload: filterOrder,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({
        message: "Filtering order failed",
        error,
      });
    }
  },

  filterOrderMe: async (req, res, next) => {
    try {
      const employeeId = req.user._id;
      const { id, status, typeOrder, startDate, paymentType, endDate } =
        req.query;

      let condition = { employeeId: employeeId };

      if (id) {
        condition._id = id;
      }

      if (typeOrder) {
        condition.isOnline = typeOrder;
      }

      if (status) {
        condition.status = status;
      }

      if (paymentType) {
        condition.paymentType = paymentType;
      }

      if (startDate && endDate) {
        const startDateTime = new Date(startDate);
        startDateTime.setUTCHours(0, 0, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: startDateTime, $lte: endDateTime };
      } else if (startDate) {
        // Nếu chỉ có startDate, lấy đơn hàng từ startDate đến ngày hiện tại
        const startDateTime = new Date(startDate);
        startDateTime.setUTCHours(0, 0, 0, 0);

        const currentDate = new Date();
        currentDate.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: startDateTime, $lte: currentDate };
      } else if (endDate) {
        // Nếu chỉ có endDate, lấy đơn hàng từ ngày bắt đầu đến endDate
        const currentDate = new Date();
        currentDate.setUTCHours(23, 59, 59, 999);

        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);

        condition.createdDate = { $gte: currentDate, $lte: endDateTime };
      }

      const filterOrder = await Order.find(condition).sort({ createdDate: -1 });
      const totalOrder = await Order.countDocuments(filterOrder);

      return res.status(200).json({
        message: "Filter Order successfully",
        total: totalOrder,
        count: filterOrder.length,
        payload: filterOrder,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({
        message: "Filtering order failed",
        error,
      });
    }
  },
};
