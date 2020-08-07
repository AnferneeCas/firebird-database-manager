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
      alert(response.data);
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
          alert(response.data);
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

///// adding new entry

var btnAddEntry = document.getElementById("addEntry");
btnAddEntry.addEventListener("click", function (evt) {
  evt.preventDefault();
  var newEntries = document.getElementsByClassName("newEntry");
  var fields = "";
  var values = "";
  for (let index = 0; index < newEntries.length; index++) {
    const element = newEntries[index];

    if (fields == "") {
      fields = fields + element.dataset.key;
    } else {
      fields = fields + ", " + element.dataset.key;
    }

    if (values == "") {
      values = values + `'${element.value}'`;
    } else {
      values = values + ", " + `'${element.value}'`;
    }
  }
  var data = {
    name: btnAddEntry.dataset.name,
    fields: fields,
    values: values,
  };
  console.log(data);
  axios
    .post("/tables/add/entry", data)
    .then((res) => {
      alert(res.data);
      window.location.replace("http://localhost:3000/tables/edit/" + data.name);
    })
    .catch(function (error) {
      alert(error);
    });
});

//INDICESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

var indexName = document.getElementById("indexName");
var indexRadio = document.getElementById("indexRadio");
var primarykeyRadio = document.getElementById("primarykeyRadio");
var foreignkeyRadio = document.getElementById("foreignkeyRadio");
var indexField = document.getElementById("indexField");
var createIndex = document.getElementById("createIndex");
var deleteBtns = document.getElementsByClassName("deleteIndex");
var tableDestination = document.getElementById("tableDestination");
var ColumnaDestination = document.getElementById("ColumnaDestination");
var Columna2Destination = document.getElementById("Columna2Destination");
createIndex.addEventListener("click", function (e) {
  var data = {
    name: indexName.value,
    field: indexField.value,
    table: createIndex.dataset.table,
  };
  console.log(data);

  if (primarykeyRadio.checked) {
    data.aux =
      Columna2Destination.options[Columna2Destination.selectedIndex].value;
    console.log("primary");
    axios
      .post("http://localhost:3000/index/index/primary", data)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((err) => {
        alert(err.data);
      });
  } else if (indexRadio.checked) {
    console.log("index");
    axios
      .post("http://localhost:3000/index/index", data)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((err) => {
        alert(err.data);
      });
  } else if (foreignkeyRadio.checked) {
    data.destinationTable =
      tableDestination.options[tableDestination.selectedIndex].value;
    data.destinationColumn =
      ColumnaDestination.options[ColumnaDestination.selectedIndex].value;
    axios
      .post("http://localhost:3000/index/index/foreign", data)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((err) => {
        alert(err.data);
      });
  }
});

for (let index = 0; index < deleteBtns.length; index++) {
  const element = deleteBtns[index];
  element.addEventListener("click", function (e) {
    console.log(element.dataset.index);
    axios
      .delete(`http://localhost:3000/index/index/${element.dataset.index}`)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((err) => {
        alert(err.data);
      });
  });
}

indexRadio.addEventListener("click", function (e) {
  tableDestination.disabled = true;
  ColumnaDestination.disabled = true;
  Columna2Destination.disabled = true;
  for (var i = 0; i < tableDestination.length; i++) {
    tableDestination.remove(i);
  }
  for (var i = 0; i < ColumnaDestination.length; i++) {
    ColumnaDestination.remove(i);
  }
  for (var i = 0; i < Columna2Destination.length; i++) {
    Columna2Destination.remove(i);
  }
});
foreignkeyRadio.addEventListener("click", function (e) {
  tableDestination.disabled = false;
});

primarykeyRadio.addEventListener("click", function (e) {
  var data = JSON.parse(primarykeyRadio.dataset.data);
  var name = primarykeyRadio.dataset.name;

  Columna2Destination.disabled = false;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    console.log(data, name);
    if (element.RDB$RELATION_NAME.trim() == name) {
      var opt = document.createElement("option");
      opt.value = element.RDB$FIELD_NAME.trim();
      opt.innerHTML = element.RDB$FIELD_NAME.trim();

      Columna2Destination.appendChild(opt);
    }
  }
});

tableDestination.addEventListener("change", function (e) {
  console.log("change");
  var value = tableDestination.options[tableDestination.selectedIndex].value;

  console.log(value);
  var data = JSON.parse(tableDestination.dataset.data);
  console.log(data);
  for (var i = 0; i < ColumnaDestination.length; i++) {
    ColumnaDestination.remove(i);
  }
  for (var i = 0; i < Columna2Destination.length; i++) {
    Columna2Destination.remove(i);
  }
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.RDB$RELATION_NAME.trim() == value) {
      var opt = document.createElement("option");
      opt.value = element.RDB$FIELD_NAME.trim();
      opt.innerHTML = element.RDB$FIELD_NAME.trim();
      ColumnaDestination.appendChild(opt);
      ColumnaDestination.disabled = false;
    }
  }
  // var opt = document.createElement("option");
  // opt.value = i;
  // opt.innerHTML = i;
  // select.appendChild(opt);
});
