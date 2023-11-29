var express = require("express");
var router = express.Router();
const access = require("../../middlewares/access");

const { validateSchema, checkIdSchema } = require("../../utils");

const {
  createProduct1,
  createProduct2,
  getAllProduct,
  getListProduct,
  getDetailProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  filterProducts,
  // uploadMultipleFiles,
  uploadSingleFile,
} = require("./controller");
const { productSchema } = require("./validation");

router
  .route("/search")
  .get(access.checkRole(["MANAGE", "SALES"]), searchProduct);
router.route("/filter").get(filterProducts);
router
  .route("/create1")
  .post(
    access.checkRole("MANAGE"),
    uploadSingleFile,
    validateSchema(productSchema),
    createProduct1
  );
router
  .route("/create2")
  .post(
    access.checkRole("MANAGE"),
    validateSchema(productSchema),
    createProduct2
  );
router.route("/").get(access.checkRole(["MANAGE", "SALES"]), getListProduct);
router.route("/all").get(access.checkRole(["MANAGE", "SALES"]), getAllProduct);
router
  .route("/:id")
  .get(
    access.checkRole(["MANAGE", "SALES"]),
    validateSchema(checkIdSchema),
    getDetailProduct
  )
  .patch(
    access.checkRole(["MANAGE"]),
    validateSchema(checkIdSchema),
    validateSchema(productSchema),
    updateProduct
  );
router
  .route("/delete/:id")
  .patch(
    access.checkRole(["MANAGE"]),
    validateSchema(checkIdSchema),
    deleteProduct
  );

module.exports = router;
