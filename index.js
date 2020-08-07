var Firebird = require("node-firebird");
var options = {
  host: "127.0.0.1",
  port: 3050,
  database: "/Users/user/Desktop/firebird/test.fdb",
  user: "SYSDBA",
  password: "masterkey",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};
var dbRef;
var db = Firebird.attach(options, function (err, db) {
  dbRef = db;
});

//IMPORTING ROUTE
const tables = require("./routes/tables");
const triggers = require("./routes/triggers");
const users = require("./routes/user");
const index = require("./routes/index");
//Express config
var cookieParser = require("cookie-parser");
const path = require("path");

const express = require("express");
const app = express();
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Adding routes
app.use("/tables", tables);
app.use("/triggers", triggers);
app.use("/users", users);
app.use("/index", index);
app.use(express.static(path.join(__dirname, "public")));

//main
app.get("/", function (req, res) {
  res.render("login");
});

app.post("/connect", function (req, res) {
  console.log(JSON.stringify(req.body));
  res.cookie("dbconnection", JSON.stringify(req.body));
  res.redirect("/tables");
});

app.post("/logout", function (req, res) {
  res.clearCookie("dbconnection");
  res.redirect("/");
});

app.listen("3000");
