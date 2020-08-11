var codeInput = document.getElementById("code");
var nombreInput = document.getElementById("nombre");
var crearBtn = document.getElementById("crearBtn");

crearBtn.addEventListener("click", function (e) {
  console.log(codeInput);
  var nombre = nombreInput.value;
  var code = codeInput.value;

  axios
    .post("http://localhost:3000/procedures", { nombre: nombre, code: code })
    .then((res) => {
      alert(res.data);
      window.location.replace("http://localhost:3000/procedures");
    })
    .catch((err) => {
      alert(err);
    });
});
