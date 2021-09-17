const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { courseValidators } = require("../tools/validators");
router.get("/", async (req, res) => {
  const courses = await Course.find().lean();
  console.log(courses);
  res.render("courses", {
    userId: req.user ? req.user._id.toString() : null,
    courses: courses,
    title: "Courses",
    isCourses: true,
  });
});

const isSameUser = (course, req) => {
  return course.userId.toString() == req.user._id.toString();
};

router.get("/:id", auth, async (req, res) => {
  const course = await Course.findById(req.params.id).lean();
  res.render("course", {
    title: `Course ${course.title}`,
    course,
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!isSameUser(course, req)) {
      res.redirect("/courses");
    }
    res.render("course-edit", {
      title: `Edit ${course.title} course`,
      course,
      error: req.flash("valError"),
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/edit", courseValidators, async (req, res) => {
  try {
    const { id } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash("valError", result.array()[0].msg);
      return res.status(422).redirect("/courses/" + id + "/edit?allow=true");
    }
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isSameUser(course, req)) {
      res.redirect("/courses");
    }
    Object.assign(course, req.body);
    await course.save();
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
