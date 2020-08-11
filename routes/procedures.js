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
  var sql = `select RDB$PROCEDURE_NAME from rdb$procedures`;
  dbRef.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.render("procedures.ejs", { data: result });
    }
  });
});

router.delete("/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var name = req.params.name;
  var sql = `drop procedure ${name}`;
  dbRef.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});

router.get("/create", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  res.render("createProcedure");
});

router.get("/edit/:name", async function (req, res) {
  res.render("EditProcedure", { name: req.params.name });
});

router.post("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `create or alter procedure ${body.nombre}
 ${body.code}
      `;
  dbRef.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});

module.exports = router;
