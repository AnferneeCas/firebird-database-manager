var dbName = document.getElementById("dbName");
var user = document.getElementById("user");
var password = document.getElementById("password");
var btncrear = document.getElementById("btncrear");

btncrear.addEventListener("click", function (e) {
  console.log("click");
  axios
    .post("http://localhost:3000/conection", {
      dbName: dbName.value,
      user: user.value,
      password: password.value,
    })
    .then((res) => {
      alert(res);
      window.location.reload();
    })
    .catch((err) => {
      alert(err);
      window.location.reload();
    });
});
// window.onbeforeunload = function (e) {
//   console.log(e);
//   return "Do you really want to close?";
// };
// window.unload = function () {
//   alert("xd");
// };
