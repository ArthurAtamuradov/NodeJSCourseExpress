const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const auth = require("../middleware/auth");
const { validationResult } = require("express-validator");
const { courseValidators } = require("../tools/validators");

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add Course",
    isAdd: true,
  });
});

router.post("/", courseValidators, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("add", {
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      },
      error: result.array()[0].msg,
      title: "Add Course",
      isAdd: true,
    });
  }
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
