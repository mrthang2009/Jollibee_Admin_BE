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
    const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    return new RegExp(regex, "gi");
  },

  sendVerificationEmail: async (email, verificationCode) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vothang226@gmail.com", // Địa chỉ email Gmail của bạn
          pass: "pnnj uhco dqjd hinx", // Mật khẩu ứng dụng của bạn
        },
      });
      // Tính thời gian hiệu lực của mã xác thực (10 phút)
      const expiresInMinutes = 3;

      // Tạo đoạn mã HTML cho email
      const emailHTML = `
            <p>Mã xác thực của bạn là: <strong>${verificationCode}</strong></p>
            <p>Mã xác thực này có hiệu lực trong vòng ${expiresInMinutes} phút.</p>
            <p>Vui lòng không chia sẻ mã này với người khác.</p>
          `;

      const mailOptions = {
        from: "vothang226@gmail.com", // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: "Xác thực địa chỉ email của bạn vào JOLLIBEE FAKE",
        html: emailHTML, // Sử dụng HTML cho nội dung email
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  },
  
  generateUniqueFileName: () => {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomChars}`;
  },
};
