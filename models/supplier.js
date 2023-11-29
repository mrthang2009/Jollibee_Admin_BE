const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Xác định bảng nhà cung cấp với các trường khác nhau và quy tắc xác thực của chúng.
const supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name: cannot be blank."],
      maxLength: [100, "Supplier name: cannot exceed 100 characters."],
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          // xác thực địa chỉ email.
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: "Email: is not a valid email address.",
      },
      required: [true, "Email cannot be blank."],
      unique: [true, " Email must be unique"],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          // Xác thực số điện thoại
          const phoneRegex = /^(0[0-9]|84[0-9])\s?\d{8,9}$/;
          return phoneRegex.test(value);
        },
        message: "Phone number: is not a valid phone number.",
      },
      unique: [true, " Phone number must be unique"],
    },
    coverImageUrl: {
      type: Schema.Types.ObjectId,
      ref: "medias",
      default: null,
    },
    address: {
      type: String,
      maxLength: [500, "Address cannot exceed 500 characters."],
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false, // Tắt trường "__v" dùng để theo dõi phiên bản
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  }
);
// Virtual with Populate
supplierSchema.virtual("media", {
  ref: "medias",
  localField: "coverImageUrl",
  foreignField: "_id",
  justOne: true,
});
// Virtuals in console.log()
supplierSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
supplierSchema.set("toJSON", { virtuals: true });

// Tạo bảng nhà cung cấp dựa trên lược đồ đã khai báo
const Supplier = model("suppliers", supplierSchema);
module.exports = Supplier;
