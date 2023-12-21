const yup = require("yup");

module.exports = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup
        .string()
        .required()
        .email()
        .test("email type", "${path} Không phải email hợp lệ", (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      password: yup
        .string()
        .required()
        .min(8, "Password: must be at least 8 characters")
        .max(20, "Password: cannot exceed 20 characters"),
    }),
  }),
  sendCodeSchema: yup.object({
    body: yup.object({
      email: yup
        .string()
        .required("email: cannot be blank")
        .test("email type", "email: is not a valid email!", (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      phoneNumber: yup.string().when("body.forgotPassword", {
        is: false,
        then: yup
          .string()
          .required("phoneNumber: cannot be blank")
          .test(
            "phoneNumber type",
            "phoneNumber: is not a valid phoneNumber!",
            (value) => {
              const phoneRegex =
                /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

              return phoneRegex.test(value);
            }
          ),
      }),
      forgotPassword: yup
        .boolean()
        .required("forgotPassword: must have a status"),
    }),
  }),
  forgotSchema: yup.object({
    body: yup.object({
      email: yup
        .string()
        .required("email: cannot be blank")
        .test("email type", "email: is not a valid email!", (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      newPassword: yup
        .string()
        .required("password: cannot be blank")
        .test(
          "password type",
          "password: is not a valid password!",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required("confirmPassword: cannot be blank")
        .test(
          "password type",
          "password: is not a valid password!",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),
      enteredCode: yup.string().required("enteredCode: cannot be blank").max(6),
    }),
  }),
};
