const yup = require("yup");
// const fs = require("fs");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    // thực thi việc xác thực
    validateSchema: (schema) => async (req, res, next) => {
        try {
            await schema.validate(
                {
                    body: req.body,
                    query: req.query,
                    params: req.params,
                },
                {
                    abortEarly: false,
                }
            );

            return next();
        } catch (err) {
            console.log("««««« err »»»»»", err);
            return res
                .status(400)
                .json({ type: err.name, errors: err.errors, provider: "YUP" });
        }
    },

    checkIdSchema: yup.object({
        params: yup.object({
            id: yup.string().test("inValid", "ID sai định dạng", (value) => {
                return ObjectId.isValid(value);
            }),
        }),
    }),

    asyncForEach: async (array, callback) => {
        for (let index = 0; index < array.length; index += 1) {
            await callback(array[index]);
        }
    },

    fuzzySearch: (text) => {
        const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        return new RegExp(regex, 'gi');
    },

    generateUniqueFileName:() =>{
        const timestamp = Date.now();
        const randomChars = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${randomChars}`;
    }
};
