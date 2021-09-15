const { body } = require("express-validator");
const User = require("../models/user");
exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("E-mail is not valid")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("User with this email already exists");
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body("password", "Password should be 6 symbols minimum")
    .isLength({
      min: 6,
      max: 50,
    })
    .isAlphanumeric(),
  body("name", "Name should be at least 3 symbols").isLength({ min: 3 }),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords should be the same");
    } else {
      return true;
    }
  }),
];

exports.loginExports;
