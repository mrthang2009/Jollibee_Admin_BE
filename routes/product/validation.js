const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  productSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required()
        .max(100, "Product names cannot exceed 100 characters"),

      price: yup
        .number()
        .min(0, "The price: of the product cannot be less than 0")
        .integer()
        .required(),

      discount: yup
        .number()
        .min(0, "Discount: cannot be less than 0")
        .max(75, "Discount: cannot be greater than 75")
        .integer()
        .required(),

      stock: yup.number().min(1).integer().required(),

      categoryId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),

      supplierId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
      description: yup
        .string()
        .max(500, "Product descriptions: must not exceed 500 characters"),
        // .required(),
      imageId: yup.string(),
      weight: yup.number().min(100).required(),
      length: yup.number().min(10).required(),
      width: yup.number().min(1).required(),
      height: yup.number().min(1).required(),
    }),
  }),
};
