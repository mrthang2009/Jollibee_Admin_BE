const yup = require("yup");

module.exports = {
  employeeSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required()
        .max(50, "Last name must exceed 50 characters"),
      lastName: yup
        .string()
        .required()
        .max(50, "Name must exceed 50 characters"),
      email: yup
        .string()
        .required()
        .test("email type", "${path} Not a valid email", (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        }),
      phoneNumber: yup
        .string()
        .required()
        .test(
          "phoneNumber type",
          "${path} Not a valid phone number",
          (value) => {
            const phoneRegex = /^(0[0-9]|84[0-9])\s?\d{8,9}$/;
            return phoneRegex.test(value);
          }
        ),

      address: yup
        .string()
        .max(500, "The address must not exceed 500 characters"),

      birthday: yup.date(),
    }),
  }),

  employeeInforSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required()
        .max(50, "Last name must exceed 50 characters"),
      lastName: yup
        .string()
        .required()
        .max(50, "Name must exceed 50 characters"),
      phoneNumber: yup
        .string()
        .test(
          "phoneNumber type",
          "${path} Not a valid phone number",
          (value) => {
            const phoneRegex = /^(0[0-9]|84[0-9])\s?\d{8,9}$/;
            return phoneRegex.test(value);
          }
        ),
      address: yup
        .string()
        .max(500, "The address must not exceed 500 characters"),
      birthday: yup.date(),
    }),
  }),

  employeeRoleSchema: yup.object({
    body: yup.object({
      typeRole: yup
        .string()
        .required()
        .oneOf(["MANAGE", "SALES", "SHIPPER"], "Invalid type role"),
    }),
  }),
  changePasswordSchema: yup.object({
    body: yup.object({
      passwordOld: yup
        .string()
        .required("passwordOld: cannot be blank")
        .test(
          "passwordOld type",
          "password: is not a valid password!",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),

      newPassword: yup
        .string()
        .required("newPassword: cannot be blank")
        .test(
          "newPassword type",
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
          "confirmPassword type",
          "confirmPassword: is not a valid password!",
          (value) => {
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            return passwordRegex.test(value);
          }
        )
        .min(8)
        .max(20),
    }),
  }),
};
