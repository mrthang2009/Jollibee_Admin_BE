const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const getListSchema = yup.object({
  query: yup.object({
    page: yup.number().min(1),
    pagesize: yup.number().min(8),
  }),
});

const updateStatusCheckedSchema = yup.object({
  body: yup.object({
    status: yup.string().oneOf(["COMPLETED", "FLAKER"], "status: is not valid"),
  }),
});

const updateCheckedSchema = yup.object({
  orderList: yup.array().of(
    yup.object().shape({
      orderId: yup
        .string()
        .test("validationOrderID", "ID: is not valid", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  )
});

module.exports = {
  getListSchema,
  updateStatusCheckedSchema,
  updateCheckedSchema,
};
