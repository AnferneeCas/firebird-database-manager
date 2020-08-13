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
router.post("/create/check", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `ALTER TABLE ${body.table}
  ADD CONSTRAINT ${body.name}
  CHECK (${body.code})
        `;
  console.log(sql);
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
  //   var sql = `select *
  //   from rdb$relations
  //  `;
  //   dbRef.query(sql, function (err, result) {
  //     console.log(result);
  //     console.log(err);
  //   });
  //   console.log("chekc");
});
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
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
  //   console.log(req.body);
});

router.delete("/delete/check/:table/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var sql = `alter table ${req.params.table} drop constraint ${req.params.name};`;
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});
router.post("/delete/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);

  await connectToDB(dbconnection);
  var sql = `DROP TABLE ${req.params.name} ;`;
  dbRef.query(sql, async function (err, result) {
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

  res.render("createTable");
});

// router.get("/edit/:name", async function (req, res) {
//   var dbconnection = JSON.parse(req.cookies.dbconnection);
//   var data = {
//     fields: [],
//     name: req.params.name,
//   };
//   await connectToDB(dbconnection);
//   dbRef.query(
//     `select rdb$field_name from rdb$relation_fields
//     where rdb$relation_name='${req.params.name}';`,
//     async function (err, result) {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//       } else {
//         data.fields = result;

//         dbRef.query(`SELECT * FROM ${req.params.name}`, function (err, result) {
//           if (err) {
//             console.log(err);
//           } else {
//             result.forEach((res) => {
//               Object.keys(res).forEach(function (key, index) {
//                 // key: the name of the object key
//                 // index: the ordinal position of the key within the object
//                 if (Buffer.isBuffer(res[key])) {
//                   res[key] = res[key].toString("utf8").trim();
//                 }
//               });
//             });
//             data.data = result;
//             console.log(data);
//             console.log(result);

//             dbRef.query(
//               `select * from RDB$INDICES where RDB$SYSTEM_FLAG = 0;
//             `,
//               function (err, result) {
//                 if (err) {
//                   res.status(500).send(err.toString());
//                 } else {
//                   console.log(result);
//                   data.indexs = result;
//                   res.render("editTable", { data: data });
//                 }
//               }
//             );

//             // console.log(result[0].TEXT.toString("utf8"));
//             // console.log(Buffer.isBuffer(result[0].TEXT));
//           }
//         });
//       }
//     }
//   );
// });

router.get("/edit/:name", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  var data = {
    fields: [],
    name: req.params.name,
  };
  await connectToDB(dbconnection);
  dbRef.query(
    "SELECT DISTINCT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$VIEW_BLR IS NULL AND RDB$SYSTEM_FLAG =0;",
    async function (err, result) {
      console.log(result);
      if (err) {
        console.log(err);
      } else {
        data.tables = result;
        var sql = `select rdb$field_name, rdb$relation_name from rdb$relation_fields
        where rdb$relation_name=`;

        for (let index = 0; index < result.length; index++) {
          const tableName = result[index].RDB$RELATION_NAME;
          if (sql[sql.length - 1] == "=") {
            sql = sql + `'${tableName.trim()}'`;
          } else {
            sql = sql + ` OR rdb$relation_name='${tableName.trim()}'`;
          }
        }
        sql = sql + ";";
        console.log(sql);
        dbRef.query(sql, async function (err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            data.fields = result;
            console.log(result);
            dbRef.query(`SELECT * FROM ${req.params.name}`, function (
              err,
              result
            ) {
              if (err) {
                console.log(err);
              } else {
                result.forEach((res) => {
                  Object.keys(res).forEach(function (key, index) {
                    // key: the name of the object key
                    // index: the ordinal position of the key within the object
                    if (Buffer.isBuffer(res[key])) {
                      res[key] = res[key].toString("utf8").trim();
                    }
                  });
                });
                data.data = result;
                console.log(data);
                console.log(result);

                dbRef.query(
                  `select * from RDB$INDICES where RDB$SYSTEM_FLAG = 0;
                `,
                  function (err, result) {
                    if (err) {
                      res.send(err.toString());
                    } else {
                      console.log(result);
                      data.indexs = result;

                      dbRef.query(
                        `SELECT RDB$CONSTRAINT_NAME
                      FROM RDB$RELATION_CONSTRAINTS  where RDB$RELATION_NAME = '${req.params.name.trim()}' `,
                        function (err, result) {
                          if (err) {
                            res.send(err.toString());
                          } else {
                            console.log(result);
                            data.checks = result;
                            res.render("editTable", { data: data });
                          }
                        }
                      );

                      // res.render("editTable", { data: data });
                    }
                  }
                );

                // console.log(result[0].TEXT.toString("utf8"));
                // console.log(Buffer.isBuffer(result[0].TEXT));
              }
            });
          }
        });
      }
    }
  );
});

router.post("/delete/:name/:fieldname", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  var sql = `ALTER TABLE ${req.params.name} DROP ${req.params.fieldname};`;
  dbRef.query(sql, async function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});
router.post("/add/:name/:fieldname", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  var sql = `ALTER TABLE ${req.body.tablename} ADD ${req.body.fieldname} ${req.body.datatype} ${req.body.attributes};`;
  console.log(sql);
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
  // dbRef.query(`insert into TEST (ID, TEXT) values (3,'Anfernee234')`, function (
  //   err,
  //   result
  // ) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(result);
  //   }
  // });
});
router.post("/add/entry", async function (req, res) {
  var dbconnection = JSON.parse(req.cookies.dbconnection);
  await connectToDB(dbconnection);
  var body = req.body;
  var sql = `insert into ${body.name} (${body.fields}) values (${req.body.values})`;
  dbRef.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err.toString());
    } else {
      res.send(sql);
    }
  });
});

module.exports = router;
