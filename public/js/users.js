var user = document.getElementById("name");
var pass = document.getElementById("password");
var create = document.getElementById("create");
var eliminarBtns = document.getElementsByClassName("eliminarbtn");
create.addEventListener("click", function (e) {
  console.log(user);
  var data = {
    user: user.value,
    pass: pass.value,
  };
  console.log("test");
  axios
    .post("http://localhost:3000/users", data)
    .then((response) => {
      alert(response.data);
      window.location.reload();
    })
    .catch((error, res) => {
      console.log(res);
      console.log(error.response);
      alert(error.response.data);
    });
});

for (let index = 0; index < eliminarBtns.length; index++) {
  const element = eliminarBtns[index];

  element.addEventListener("click", function (e) {
    var id = element.dataset.id;
    console.log(id);

    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((error, res) => {
        console.log(res);
        console.log(error.response);
        alert(error.response.data);
      });
  });
}
