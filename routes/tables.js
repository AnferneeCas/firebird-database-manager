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

//routes /tables

//OBTENER TODAS LAS TABLAS
router.get("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);

  dbRef.query(
    "SELECT DISTINCT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$VIEW_BLR IS NULL AND RDB$SYSTEM_FLAG =0;",
    function (err, result) {
      // IMPORTANT: close the connection
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.render("tables", { data: result });
      }
    }
  );
});

//CREAR TABLA
router.post("/", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  console.log("post table");
  var body = req.body;
  console.log(body);
  // {
  //   name: "tablename";
  //   fields: [{ name: "fieldNames",datatype:"int", attributes: "not null primary" }];
  // }

  var sql = `CREATE TABLE ${body.name} (`;
  body.fields.forEach((field) => {
    if (sql[sql.length - 1] != "(") {
      sql = sql + ",";
    }
    sql = sql + ` ${field.name} ${field.datatype} ${field.attributes}`;
  });
  sql = sql + " );";
  console.log(sql);
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.redirect("/tables");
    }
  });
  //   console.log(req.body);
});

router.post("/delete/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);

  dbRef.query(`DROP TABLE ${req.params.name} ;`, async function (err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.redirect("/tables");
    }
  });
});

router.get("/create", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);

  res.render("createTable");
});

router.get("/edit/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  var data = {
    fields: [],
    name: req.params.name,
  };
  await connectToDB(dbconnection);
  dbRef.query(
    `select rdb$field_name from rdb$relation_fields
    where rdb$relation_name='${req.params.name}';`,
    async function (err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        data.fields = result;
        res.render("editTable", { data: data });
      }
    }
  );
});

router.post("/delete/:name/:fieldname", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  dbRef.query(
    `ALTER TABLE ${req.params.name} DROP ${req.params.fieldname};`,
    async function (err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.redirect("/tables/edit/" + req.params.name);
      }
    }
  );
});
router.post("/add/:name/:fieldname", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  dbRef.query(
    `ALTER TABLE ${req.body.tablename} ADD ${req.body.fieldname} ${req.body.datatype} ${req.body.attributes};`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.redirect("/tables/edit/" + req.params.name);
      }
    }
  );
});
module.exports = router;
