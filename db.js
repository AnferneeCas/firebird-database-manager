var Firebird = require("node-firebird");
var options = {};

options.host = "127.0.0.1";
options.port = 3050;
// options.database = `C:Users\\user\\Desktop\\firebird\\TEST.FDB`;
options.database = "/Users/user/Desktop/firebird/test.fdb";
options.user = "SYSDBA";
options.password = "masterkey";
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null; // default
options.pageSize = 4096;
var db;
Firebird.attach(options, function (err, db) {
  db = db;
  console.log(err);
  console.log(db);
});
