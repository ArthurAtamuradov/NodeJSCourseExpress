const { Router } = require("express");
const User = require("../models/user");
const { route } = require("./courses");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
const { registerValidators, loginValidators } = require("../tools/validators");
const router = Router();

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
    isLogin: true,
    registerError: req.flash("registerError"),
    loginError: req.flash("loginError"),
  });
});

router.post("/login", loginValidators, async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash("loginError", result.array()[0].msg);
      return res.status(422).redirect("/auth/login#login");
    }
    const candidate = await User.findOne({ email: req.body.email });
    req.session.isAuthenticated = true;
    req.session.user = candidate;
    req.session.save((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/logout", async (req, res) => {
  // req.session.isAuthenticated = false;
  console.log("logging out");
  await req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});
router.post("/register", registerValidators, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const candidate = await User.findOne({ email });
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash("registerError", result.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      card: { items: [] },
    });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
