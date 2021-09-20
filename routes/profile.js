const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();
const User = require("../models/user");

router.get("/", auth, (req, res) => {
  res.render("profile", {
    title: "User profile page",
    isProfile: true,
    user: req.user.toObject(),
  });
});
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
    };
    if (req.file) {
      toChange.avatarUrl = req.file.filename;
    }
    Object.assign(user, toChange);
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
