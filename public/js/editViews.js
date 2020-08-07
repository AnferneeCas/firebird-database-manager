var nombre = document.getElementById("nombre");
var code = document.getElementById("code");
var crearBtn = document.getElementById("crearBtn");

crearBtn.addEventListener("click", function (e) {
  var name = nombre.value;
  var codigo = code.value;
  axios
    .put("http://localhost:3000/views", { nombre: name, codigo: codigo })
    .then((res) => {
      alert(res.data);
      window.location.replace("http://localhost:3000/views");
    })
    .catch((error) => {
      alert(error);
    });
});
