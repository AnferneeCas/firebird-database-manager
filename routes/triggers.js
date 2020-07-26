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

//routes /tables
router.get("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);

  dbRef.query(
    "SELECT DISTINCT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$VIEW_BLR IS NULL AND RDB$SYSTEM_FLAG =0;",
    function (err, result) {
      // IMPORTANT: close the connection
      if (err) {
        console.log(err);
      }

      res.render("triggers");
    }
  );
});

module.exports = router;
