var express = require("express");
var router = express.Router();

let { validateSchema, checkIdSchema } = require("../../utils");
const {
  createSupplier,
  getAllSupplier,
  getDetailSupplier,
  updateSupplier,
  deleteSupplier,
  searchSupplier
} = require("./controller");
const {
  supplierSchema,
} = require("./validation");

router
  .route("/search")
  .get( searchSupplier);
router
  .route("/")
  .post(validateSchema(supplierSchema), createSupplier);
router.route("/all").get(getAllSupplier);
router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetailSupplier)
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(supplierSchema),
    updateSupplier
  );
router
  .route("/delete/:id")
  .patch(
    validateSchema(checkIdSchema),
    deleteSupplier
  );

module.exports = router;
