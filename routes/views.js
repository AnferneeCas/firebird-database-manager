var Firebird = require("node-firebird");
var options = {
  host: "127.0.0.1",
  port: 3050,
  database: "/Users/user/Desktop/firebird/",
  user: "SYSDBA",
  password: "masterkey",
  lowercase_keys: false,
  role: "RDB$ADMIN",
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
    console.log(tmpOptions);
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
  var sql =
    "SELECT DISTINCT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$VIEW_BLR IS NOT NULL AND RDB$SYSTEM_FLAG =0;";
  dbRef.query(sql, function (err, result) {
    // IMPORTANT: close the connection
    if (err) {
      res.send(err.toString());
    } else {
      res.render("views", { data: result });
    }
  });
});

router.get("/create", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var sql = `CREATE VIEW TEST as select ID from TESTCREACION;`;
  res.render("createView");
});

router.post("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `CREATE VIEW ${body.nombre} ${body.codigo}`;
  dbRef.query(sql, function (err, result) {
    // IMPORTANT: close the connection
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});

router.get("/update/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  // var sql = `alter VIEW TESTVIEW as select ID from TESTCREACION;`;
  // dbRef.query(sql, function (err, result) {
  //   // IMPORTANT: close the connection
  //   if (err) {
  //     console.log(err);
  //     res.send(err.toString());
  //   } else {
  //     console.log(result);
  //     res.send(sql);
  //   }
  // });

  res.render("editView", { data: req.params.name });
});

router.put("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `alter VIEW ${body.nombre} ${body.codigo}`;
  dbRef.query(sql, function (err, result) {
    // IMPORTANT: close the connection
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

router.delete("/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  var name = req.params.name;
  await connectToDB(dbconnection);
  var sql = `DROP VIEW ${name};`;
  dbRef.query(sql, function (err, result) {
    // IMPORTANT: close the connection
    if (err) {
      res.send(err.toString());
      console.log(err);
    } else {
      res.send(sql);
    }
  });
});

module.exports = router;
