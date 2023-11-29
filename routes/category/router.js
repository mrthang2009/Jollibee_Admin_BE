var express = require("express");
var router = express.Router();
const access = require("../../middlewares/access");

let { validateSchema, checkIdSchema } = require("../../utils");
const {
  createCategory1,
  createCategory2,
  getAllCategory,
  getListCategory,
  getDetailCategory,
  updateCategory,
  deleteCategory,
  searchCategory,
  uploadSingleFile,
} = require("./controller");
const { categorySchema } = require("./validation");

router
  .route("/search")
  .get(access.checkRole(["MANAGE", "SALES"]), searchCategory);
router
  .route("/create1")
  .post(
    access.checkRole("MANAGE"),
    uploadSingleFile,
    validateSchema(categorySchema),
    createCategory1
  );
  router
  .route("/create2")
  .post(
    access.checkRole("MANAGE"),
    validateSchema(categorySchema),
    createCategory2
  );
router
  .route("/create2")
  .post(
    access.checkRole("MANAGE"),
    validateSchema(categorySchema),
    createCategory2
  );
router.route("/all").get(access.checkRole(["MANAGE", "SALES"]), getAllCategory);
router.route("/").get(access.checkRole(["MANAGE", "SALES"]), getListCategory);
router
  .route("/:id")
  .get(
    access.checkRole(["MANAGE", "SALES"]),
    validateSchema(checkIdSchema),
    getDetailCategory
  )
  .patch(
    access.checkRole(["MANAGE"]),
    validateSchema(checkIdSchema),
    validateSchema(categorySchema),
    updateCategory
  );
router
  .route("/delete/:id")
  .patch(
    access.checkRole(["MANAGE"]),
    validateSchema(checkIdSchema),
    deleteCategory
  );

module.exports = router;
