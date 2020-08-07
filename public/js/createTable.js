var table = document.getElementById("table");

var btn = document.getElementById("createBtn");
var btnsdelete = document.getElementsByClassName("deleteBtn");
var tableData = {
  name: "",
  fields: [],
};
btn.addEventListener("click", function (evt) {
  event.preventDefault();
  console.log(table);
  var nombreCampo = document.getElementById("nombreCampo").value;
  var datatypeCampo = document.getElementById("datatypeCampo").value;
  var primarykey = document.getElementById("primarykey").checked
    ? "primary key"
    : "";
  var notnull = document.getElementById("notnull").checked ? "not null" : "";
  var unique = document.getElementById("unique").checked ? "unique" : "";
  var row = table.insertRow(1);
  row.setAttribute("id", nombreCampo);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  //adding classes
  cell1.classList.add("text-center");
  cell2.classList.add("text-center");
  cell3.classList.add("text-center");

  var attributes = primarykey + " " + notnull + " " + unique;
  cell1.innerHTML = nombreCampo;
  cell2.innerHTML = datatypeCampo;
  cell3.innerHTML = attributes;
  cell4.innerHTML = `<button  data-rowid="${nombreCampo}" class="btn btn-danger deleteBtn">Eliminar</button>`;
  tableData.fields.push({
    name: nombreCampo,
    datatype: datatypeCampo,
    attributes: attributes,
  });
  btnsdelete = document.getElementsByClassName("deleteBtn");
  updateBtnsDelete();
});
updateBtnsDelete();

function updateBtnsDelete() {
  for (let index = 0; index < btnsdelete.length; index++) {
    const btn = btnsdelete[index];
    btn.addEventListener("click", function (evt) {
      evt.preventDefault();

      tableData.fields = tableData.fields.filter(function (el) {
        return el.name != btn.dataset.rowid;
      });

      var row = document.getElementById(btn.dataset.rowid);
      row.parentNode.removeChild(row);
    });
  }
}
var btnCrear = document.getElementById("createTable");
btnCrear.addEventListener("click", function (evt) {
  event.preventDefault();
  tableData.name = document.getElementById("name").value;
  axios
    .post("/tables", tableData)
    .then(function (response) {
      alert(response.data);
      window.location.replace("http://localhost:3000/tables");
    })
    .catch(function (error) {
      alert(error);
    });
});
