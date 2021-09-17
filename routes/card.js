const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const auth = require("../middleware/auth");

const calculatePrice = (courses) => {
  return courses.reduce((total, course) => {
    return (total += course.count * course.price);
  }, 0);
};
const mapCardItems = (card) => {
  return card.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
};
router.post("/add", async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCard(course);
  res.redirect("/card");
});

router.get("/", auth, async (req, res) => {
  // console.log(req.user);
  const user = await req.user.populate("card.items.courseId").execPopulate();

  const courses = mapCardItems(user.card);
  //console.log(courses);
  res.render("card", {
    title: "Card",
    isCard: true,
    courses: courses,
    price: calculatePrice(courses),
  });
});
router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCard(req.params.id);
  const user = await req.user.populate("card.items.courseId").execPopulate();
  const courses = mapCardItems(user.card);
  const card = {
    price: calculatePrice(courses),
    courses: courses,
  };
  res.json(card);
});
module.exports = router;
