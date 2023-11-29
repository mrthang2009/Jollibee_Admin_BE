const { Supplier } = require("../../models");
const { fuzzySearch } = require("../../utils");

module.exports = {
  createSupplier: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address } = req.body;

      const newSupplier = new Supplier({
        name,
        email,
        phoneNumber: phoneNumber ? phoneNumber : null,
        address,
      });

      const payload = await newSupplier.save();
      res.status(200).json({ message: "Add supplier successfully", payload, });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res.status(400).json({ message: "Adding supplier failed", error, });

    }
  },

  getAllSupplier: async (req, res, next) => {
    try {
      const payload = await Supplier.find({ isDeleted: false });
      const total = payload.length;
      res.status(200).json({ message: "Retrieve suppliers data successfully", total, payload, });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res.status(400).json({ message: "Retrieving suppliers data failed", error, });
    }
  },

  getDetailSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Supplier.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!payload) {
        res.status(400).json({ message: "No supplier found in data", });
      }
      res.status(200).json({ message: "Retrieve detailed supplier data successfully", payload, });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res.status(400).json({ message: "Retrieving detailed supplier data failed", error, });
    }
  },

  updateSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, address } = req.body;

      const payload = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, email, phoneNumber, address },
        { new: true });
      if (!payload) {
        res.status(400).json({ message: "No supplier found in data", });
      }
      res.status(200).json({ message: "Updated supplier data successfully", payload, });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res.status(400).json({ message: "Updating supplier data failed", error, });
    }
  },

  deleteSupplier: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (!payload) {
        res.status(400).json({ message: "No supplier found in data", });
      }
      res.status(200).json({ message: "Delete supplier data successfully", });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      res.status(400).json({ message: "Delete supplier data failed", error, });

    }
  },

  searchSupplier: async (req, res, next) => {
    try {
      const { keyword } = req.query;

      const conditionFind = { isDeleted: false };

      const payload = await Supplier.find({
        ...conditionFind,
        $or: [
          { name: { $regex: fuzzySearch(keyword) } },
          { email: { $regex: fuzzySearch(keyword) } },
          { phoneNumber: { $regex: fuzzySearch(keyword) } },
        ]
      }).sort({ name: 1 });

      const totalSupplier = await Supplier.countDocuments(conditionFind);

      if (payload) {
        return res.status(200).json({
          message: "Search information of suppliers successfully",
          totalSupplier,
          count: payload.length,
          payload,
        });
      }

      return res.status(410).json({
        message: "Search information of suppliers not found",
      });
    } catch (err) {
      return res.status(404).json({
        message: "Search information of suppliers failed",
        error: err,
      });
    }
  },
};
