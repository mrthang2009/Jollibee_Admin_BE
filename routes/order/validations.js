const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  orderSchema: yup.object().shape({
    body: yup.object().shape({
      createdDate: yup.date(),
      shippedDate: yup.date(),
      paymentType: yup
        .string()
        .default("CASH")
        .oneOf(["CASH", "CARD"], "Invalid payment form"),
      status: yup
        .string()
        .default("PLACED")
        .oneOf(
          [
            "PLACED",
            "PREPARED",
            "DELIVERING",
            "COMPLETED",
            "CANCELED",
            "REJECTED",
            "FLAKER",
          ],
          "Invalid status"
        ),
      customerId: yup
        .string()
        .test(
          "validationCustomerID",
          "customerId is in wrong format",
          (value) => {
            if (!value) return true; // Nếu customerId không được cung cấp, bỏ qua kiểm tra định dạng
            return true; // Không cần kiểm tra định dạng nếu có giá trị
          }
        )
        .default("Direct customers"),
      employeeId: yup.string(),
      // .test('validationEmployeeID', 'employeeId is in wrong format', (value) => {
      //   return ObjectId.isValid(value);
      // }),
      productList: yup
        .array()
        .of(
          yup.object().shape({
            productId: yup
              .string()
              .required()
              .test(
                "validationProductID",
                "productId sai định dạng",
                (value) => {
                  return ObjectId.isValid(value);
                }
              ),
            quantity: yup.number().required().min(1).default(1),
          })
        )
        .required("Product list is required"),
    }),
  }),

  updateStatusSchema: yup.object({
    body: yup.object({
      status: yup
        .string()
        .oneOf(
          ["PREPARED", "CANCELED", "DELIVERING", "COMPLETED", "FLAKER"],
          "Invalid status"
        ),
    }),
  }),
  updateEmployeeIdSchema: yup.object({
    body: yup.object({
      status: yup.string().oneOf(["DELIVERING"], "Invalid status"),
      employeeId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          if (!value) return true;
          return ObjectId.isValid(value);
        }),
    }),
  }),
};
