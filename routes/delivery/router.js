const express = require("express");
const router = express.Router();
const access = require("../../middlewares/access");

const { validateSchema, checkIdSchema } = require("../../utils");

const {
    getListSchema,
    updateStatusCheckedSchema,
    updateCheckedSchema,
} = require("./validation");

const {
    getListOrder,
    getListOrderChecked,
    getDetail,
    updateStatusChecked,
    updateChecked,
} = require("./controller");

router
    .route("/")
    .get(
        access.checkRole(["MANAGE", "SHIPPER"]),
        validateSchema(getListSchema),
        getListOrder
    );

router
    .route("/orderChecked")
    .get(
        access.checkRole(["SHIPPER"]),
        validateSchema(getListSchema),
        getListOrderChecked
    );

router
    .route("/updateChecked")
    .patch(
        access.checkRole(["SHIPPER"]),
        validateSchema(updateCheckedSchema),
        updateChecked
    );

router
    .route("/:id")
    .get(access.checkRole(["SHIPPER"]), validateSchema(checkIdSchema), getDetail);

router
    .route("/status/:id")
    .patch(
        access.checkRole(["SHIPPER"]),
        validateSchema(checkIdSchema),
        validateSchema(updateStatusCheckedSchema),
        updateStatusChecked
    );

module.exports = router;
