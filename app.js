var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const access = require("./middlewares/access");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth/router");
var employeesRouter = require("./routes/employee/router");
var categoriesRouter = require("./routes/category/router");
var customersRouter = require("./routes/customer/router");
var suppliersRouter = require("./routes/supplier/router");
var productsRouter = require("./routes/product/router");
var ordersRouter = require("./routes/order/router");
var mediasRouter = require("./routes/media/router");
var deliveriesRouter = require("./routes/delivery/router");

// Khai báo DB và kết nối đến đường dẫn DB
const { CONNECTION_STRING, DB_NAME } = require("./constants/db");
mongoose.connect(`${CONNECTION_STRING}${DB_NAME}`);

const {
  VerifyTokenEmployee,
  VerifyAccountEmployee,
  ConfigBasicEmployee,
} = require("./middlewares/passport");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

passport.use(VerifyTokenEmployee);
passport.use(VerifyAccountEmployee);
passport.use(ConfigBasicEmployee);

app.use("/", indexRouter);
app.use("/auth", authRouter);
// app.use("/employees", employeesRouter);
app.use(
  "/employees",
  passport.authenticate("jwt", { session: false }),
  employeesRouter
);
app.use(
  "/categories",
  passport.authenticate("jwt", { session: false }),
  categoriesRouter
);
app.use(
  "/deliveries",
  passport.authenticate("jwt", { session: false }),
  deliveriesRouter
);
app.use(
  "/products",
  passport.authenticate("jwt", { session: false }),
  productsRouter
);
app.use(
  "/orders",
  passport.authenticate("jwt", { session: false }),
  ordersRouter
);
app.use(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  access.checkRole(["MANAGE", "SALES", "SHIPPER"]),
  customersRouter
);
app.use(
  "/suppliers",
  passport.authenticate("jwt", { session: false }),
  access.checkRole(["MANAGE"]),
  suppliersRouter
);
app.use(
  "/medias",
  passport.authenticate("jwt", { session: false }),
  mediasRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
