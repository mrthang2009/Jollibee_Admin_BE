const yup = require("yup");

module.exports = {
  categorySchema: yup.object({
    body: yup.object({
      name: yup.string().required().max(50, "Name must exceed 50 characters"),
      description: yup
        .string()
        .max(500, "Description must exceed 500 characters"),
      imageId: yup.string(),
    }),
  }),
};
