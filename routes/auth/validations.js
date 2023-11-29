const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup.string()
        .required()
        .email()
        .test('email type', '${path} Không phải email hợp lệ', (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      password: yup.string()
        .required()
        .min(8, "Password: must be at least 8 characters")
        .max(20, "Password: cannot exceed 20 characters"),
    }),
  }),
};