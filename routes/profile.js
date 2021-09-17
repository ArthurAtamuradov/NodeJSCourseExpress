const { Router } = require("express");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("profile", {
    title: "User profile page",
    isProfile: true,
  });
});
router.post("/", (req, res) => {});
module.exports = router;
