var express = require("express");
const router = express.Router();

const { validateSchema, checkIdSchema } = require("../../utils");
const {
  createCustomer,
  getAllCustomer,
  getDetailCustomer,
  searchCustomer,
  getListCustomer,
} = require("./controller");
const { customerSchema } = require("./validation");

router.route("/search").get(searchCustomer);
router.route("/create").post(validateSchema(customerSchema), createCustomer);
router.route("/all").get(getAllCustomer);
router.route("/").get(getListCustomer);

router.route("/:id").get(validateSchema(checkIdSchema), getDetailCustomer);

module.exports = router;
