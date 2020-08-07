var btnBorrar = document.getElementsByClassName("btn-borrar");
for (let index = 0; index < btnBorrar.length; index++) {
  const btn = btnBorrar[index];
  btn.addEventListener("click", function (evt) {
    axios
      .delete(`http://localhost:3000/views/${btn.dataset.name}`)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  });
}
