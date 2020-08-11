var Firebird = require("node-firebird");
var options = {
  host: "127.0.0.1",
  port: 3050,
  database: "/Users/user/Desktop/firebird/",
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

async function connectToDB(dbconnection) {
  return new Promise((resolve, reject) => {
    var tmpOptions = options;
    tmpOptions.database =
      "/Users/user/Desktop/firebird/" + dbconnection.name + ".fdb";
    tmpOptions.user = dbconnection.user;
    tmpOptions.password = dbconnection.pass;

    Firebird.attach(tmpOptions, function (err, db) {
      dbRef = db;

      resolve(db);
    });
  });
}
//express

const express = require("express");
let router = express.Router();

router.get("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  res.render("conection");
});

router.post("/", async function (req, res) {
  var body = req.body;
  console.log(body);
  var options = {
    host: "127.0.0.1",
    port: 3050,
    database: "/Users/user/Desktop/firebird/" + body.dbName + ".FDB",
    user: body.user,
    password: body.password,
    lowercase_keys: false,
    role: null,
    pageSize: 4096,
  };
  Firebird.create(options, (err, db) => {
    if (err) {
      res.send(err.toString());
    } else {
      res.send("Base de datos creada");
    }
  });
});

module.exports = router;
