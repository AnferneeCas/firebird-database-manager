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
    "SELECT RDB$TRIGGER_NAME AS trigger_name,RDB$RELATION_NAME AS table_name FROM RDB$TRIGGERS WHERE RDB$SYSTEM_FLAG = 0;",
    function (err, result) {
      // IMPORTANT: close the connection
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        res.render("triggers", { data: result });
      }
    }
  );
});

router.post("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  console.log(body);
  var sql = `create trigger ${body.trigger_name} for ${body.trigger_table} ${body.type} ${body.action} as ${body.code}`;
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);

      res.send(sql);
    }
  });
  // dbRef.query(
  //   `create trigger test_trigger2 for TEST
  // before insert or update
  //               as
  //               begin
  //               if (inserting and new.TEXT is null)
  //               then new.TEXT = 'FKCR';

  //               end`,
  //   function (err, result) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(result);
  //     }
  //   }
  // );
});

router.post("/:trigger", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var sql = `DROP TRIGGER ${req.params.trigger} ;`;
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      console.log(result);
      res.send(sql);
    }
  });
});

router.get("/:trigger", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  dbRef.query(
    `SELECT RDB$TRIGGER_NAME AS trigger_name,RDB$RELATION_NAME AS table_name FROM RDB$TRIGGERS WHERE RDB$SYSTEM_FLAG = 0 AND RDB$TRIGGER_NAME = '${req.params.trigger}';`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("editTrigger", { data: result[0] });
      }
    }
  );
});

router.get("/create/trigger", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  dbRef.query(
    `SELECT DISTINCT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$VIEW_BLR IS NULL AND RDB$SYSTEM_FLAG =0;`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.render("createTrigger", { data: result });
      }
    }
  );
});

router.patch("/trigger", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `ALTER TRIGGER ${body.trigger_name} ACTIVE  ${body.type} ${body.action} AS ${body.code};`;

  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
      // res.render("editTrigger", { data: result[0] });
    }
  });
});
module.exports = router;
