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

router.post("/index", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `create index ${body.name} on ${body.table} computed by (upper(${body.field}));`;
  dbRef.query(sql, async function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

router.delete("/index/:indexName", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var indexName = req.params.indexName;

  var sql = `drop index ${indexName};`;

  dbRef.query(sql, async function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

router.post("/index/foreign", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;

  var sql = `alter table ${body.table}
  add constraint ${body.name}
  foreign key (${body.field}) references ${body.destinationTable}(${body.destinationColumn})`;
  dbRef.query(sql, async function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

router.post("/index/primary", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `alter table ${body.table} add constraint ${body.name} primary key (${body.field});`;
  console.log(sql);
  dbRef.query(sql, async function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

module.exports = router;
