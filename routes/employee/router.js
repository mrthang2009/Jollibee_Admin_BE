const express = require("express");
const router = express.Router();
const access = require("../../middlewares/access");

const { validateSchema, checkIdSchema } = require("../../utils");
const {
  createEmployee,
  getAllEmployee,
  getDetailMe,
  getDetailEmployee,
  updateInformationEmployee,
  updateRoleEmployee,
  deleteEmployee,
  searchEmployee,
  getListEmployee,
  changePassword,
} = require("./controller");
const {
  employeeSchema,
  employeeInforSchema,
  employeeRoleSchema,
  changePasswordSchema
} = require("./validation");
router.route("/change-password").patch(validateSchema(changePasswordSchema),changePassword);
router;
router
  .route("/search")
  .get(access.checkRole(["MANAGE", "SALES"]), searchEmployee);
router
  .route("/create")
  .post(
    access.checkRole("MANAGE"),
    validateSchema(employeeSchema),
    createEmployee
  );
router.route("/all").get(access.checkRole("MANAGE"), getAllEmployee);
router.route("/").get(access.checkRole("MANAGE"), getListEmployee);
router.route("/detailMe").get(getDetailMe);
router
  .route("/updateMe")
  .patch(
    access.checkRole(["MANAGE", "SALES", "SHIPPER"]),
    validateSchema(employeeInforSchema),
    updateInformationEmployee
  );
router
  .route("/:id")
  .get(
    access.checkRole("MANAGE"),
    validateSchema(checkIdSchema),
    getDetailEmployee
  )
  .patch(
    access.checkRole("MANAGE"),
    validateSchema(checkIdSchema),
    validateSchema(employeeRoleSchema),
    updateRoleEmployee
  );
router
  .route("/delete/:id")
  .patch(
    access.checkRole("MANAGE"),
    validateSchema(checkIdSchema),
    deleteEmployee
  );

module.exports = router;
