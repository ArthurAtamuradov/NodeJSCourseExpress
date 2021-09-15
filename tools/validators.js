const { body } = require("express-validator");
exports.registerValidators = [
  body("email").isEmail().withMessage("E-mail is not valid"),
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
