const { Router } = require("express");
const Order = require("../models/order");
const router = Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ "user.userId": req.user._id }).populate(
    "user.userId"
  );
  console.log(orders);
  console.log(
    orders.map((o) => ({
      ...o._doc,
      price: o.courses.reduce((total, c) => {
        return (total += c.count * c.course.count);
      }, 0),
    }))
  );
  res.render("orders", {
    isOrders: true,
    orders: orders.map((o) => {
      console.log({
        ...o._doc,
        price: o.courses.reduce((total, c) => {
          return (total += c.count * c.course.price);
        }, 0),
      });
      return {
        ...o._doc,
        price: o.courses.reduce((total, c) => {
          return (total += c.count * c.course.price);
        }, 0),
      };
    }),
  });
});
router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("card.items.courseId").execPopulate();
    console.log(user);
    const courses = user.card.items.map((c) => ({
      count: c.count,
      course: { ...c.courseId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });
    await order.save();
    await req.user.clearCard();
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
