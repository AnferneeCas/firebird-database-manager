var table = document.getElementById("table");

var btn = document.getElementById("createBtn");
var btnsdelete = document.getElementsByClassName("deleteColumn");

//agrega columna
btn.addEventListener("click", function (evt) {
  event.preventDefault();

  var nombreCampo = document.getElementById("nombreCampo").value;
  var datatypeCampo = document.getElementById("datatypeCampo").value;
  var primarykey = document.getElementById("primarykey").checked
    ? "primary key"
    : "";
  var notnull = document.getElementById("notnull").checked ? "not null" : "";
  var unique = document.getElementById("unique").checked ? "unique" : "";

  var attributes = primarykey + " " + notnull + " " + unique;
  var tablename = btn.dataset.tablename;
  var newField = {
    tablename: tablename,
    datatype: datatypeCampo,
    attributes: attributes,
    fieldname: nombreCampo,
  };

  axios
    .post(`/tables/add/${tablename}/${nombreCampo}`, newField)
    .then(function (response) {
      window.location.replace("http://localhost:3000/tables/edit/" + tablename);
    })
    .catch(function (error) {
      alert(error);
    });
});
updateBtnsDelete();

function updateBtnsDelete() {
  for (let index = 0; index < btnsdelete.length; index++) {
    const btn = btnsdelete[index];
    btn.addEventListener("click", function (evt) {
      evt.preventDefault();

      var tablename = btn.dataset.tablename;
      var columnname = btn.dataset.columnname;
      axios
        .post(`/tables/delete/${tablename}/${columnname}`)
        .then(function (response) {
          window.location.replace(
            "http://localhost:3000/tables/edit/" + tablename
          );
        })
        .catch(function (error) {
          alert(error);
        });
    });
  }
}
