const express = require("express");
const exhbs = require("express-handlebars");
const { extname } = require("path");
const csrf = require("csurf");
const path = require("path");
const flash = require("connect-flash");
const { title } = require("process");
const coursesRoutes = require("./routes/courses");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const User = require("./models/user");
const userMiddleware = require("./middleware/user");
const session = require("express-session");
const varMiddleware = require("./middleware/variables");
const app = express();

const hbs = exhbs.create({
  defaultLayout: "main",
  extname: "hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: require("./tools/hbs-helpers"),
});

const url = "mongodb://127.0.0.1:27017";

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
// app.use(async (req, res, next) => {
//   const user = await User.findOne();
//   req.user = user;
//   next();
// });
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use("/courses", coursesRoutes);
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  const url = "mongodb://127.0.0.1:27017/Courses";
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(3000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
