const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add Course",
    isAdd: true,
  });
});

router.post("/", async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });
  try {
    await course.save();
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
