var btnBorrar = document.getElementsByClassName("btn-borrar");

for (let index = 0; index < btnBorrar.length; index++) {
  const element = btnBorrar[index];

  element.addEventListener("click", function (e) {
    console.log("click");
    axios
      .delete(`http://localhost:3000/procedures/${element.dataset.name}`)
      .then((res) => {
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  });
}
