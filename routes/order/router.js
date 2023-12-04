const express = require("express");
const router = express.Router();
const access = require("../../middlewares/access");

const { validateSchema, checkIdSchema } = require("../../utils");
const { orderSchema, updateStatusSchema } = require("./validations");
const {
  createOrder,
  // getAllOrder,
  getDetail,
  updateStatus,
  updateEmployeeId,
  filterOrder,
  getListOrder,
  getListOrderMe,
  getListPendingOrder,
  filterOrderMe,
  getOrdersByYear,
  getOrdersMeByMonth,
} = require("./controller");

router
  .route("/create")
  .post(access.checkRole("SALES"), validateSchema(orderSchema), createOrder);
router
  .route("/orders-by-year")
  .get(access.checkRole("MANAGE"), getOrdersByYear);
router
  .route("/orders-by-month")
  .get(access.checkRole(["SHIPPER", "SALES"]), getOrdersMeByMonth);
// router.route("/all").get(access.checkRole("MANAGE"), getAllOrder);
router.route("/").get(access.checkRole("MANAGE"), getListOrder);
router
  .route("/filter")
  .get(access.checkRole(["SHIPPER", "SALES", "MANAGE"]), filterOrder);

router.route("/me").get(access.checkRole(["SHIPPER", "SALES"]), getListOrderMe);
router
  .route("/pending")
  .get(access.checkRole(["SHIPPER", "SALES"]), getListPendingOrder);
router
  .route("/filter/me")
  .get(access.checkRole(["SHIPPER", "SALES"]), filterOrderMe);

router
  .route("/:id")
  .get(
    access.checkRole(["MANAGE", "SALES", "SHIPPER"]),
    validateSchema(checkIdSchema),
    getDetail
  );

router
  .route("/status/:id")
  .patch(
    access.checkRole(["SALES", "SHIPPER"]),
    validateSchema(updateStatusSchema),
    updateStatus
  );
router
  .route("/status&employeeId/:id")
  .patch(
    access.checkRole("SHIPPER"),
    validateSchema(updateStatusSchema),
    updateEmployeeId
  );

module.exports = router;
