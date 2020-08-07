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
  dbRef.query(`SELECT DISTINCT RDB$USER FROM RDB$USER_PRIVILEGES;`, function (
    err,
    result
  ) {
    if (err) {
      console.log(err);

      res.status(500).send(err.toString());
    } else {
      res.render("users", { data: result });
    }
  });
});

router.post("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  console.log(body);
  var sql = `CREATE USER ${body.user} PASSWORD '${body.pass}' GRANT ADMIN ROLE; `;
  dbRef.query(sql, function (err, result) {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      dbRef.query(`grant rdb$admin to ${body.user}`, function (err, result) {
        if (err) {
          res.status(500).send(err.toString());
        } else {
          res.send(sql);
        }
      });
    }
  });
});

router.delete("/:id", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  console.log(req.params.id);
  await connectToDB(dbconnection);
  var sql = `revoke rdb$admin from ${req.params.id};`;
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send(err.toString());
    } else {
      dbRef.query(`drop user ${req.params.id};`, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send(err.toString());
        } else {
          res.send(sql);
          console.log(result);
        }
      });
    }
  });
});

module.exports = router;
