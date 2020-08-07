var mainBtn = document.getElementById("btn");
var radioAfter = document.getElementById("optionAfter");
var radioBefore = document.getElementById("optionBefore");
var insert = document.getElementById("insert");
var update = document.getElementById("update");
var tdelete = document.getElementById("delete");
var code = document.getElementById("code");

var trigger_name = document.getElementById("trigger_name").value;

var trigger_table = document.getElementById("trigger_table").value;
mainBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  var type = radioAfter.checked ? "AFTER" : "BEFORE";
  var action = "";

  if (insert.checked) {
    if (action == "") {
      action = action + insert.value;
    } else {
      action = action + " OR " + insert.value;
    }
  }
  if (update.checked) {
    if (action == "") {
      action = action + update.value;
    } else {
      action = action + " OR " + update.value;
    }
  }

  if (tdelete.checked) {
    if (action == "") {
      action = action + tdelete.value;
    } else {
      action = action + " OR " + tdelete.value;
    }
  }
  var data = {
    type: type.trim(),
    action: action.trim(),
    code: code.value.toString().trim(),
    trigger_name: trigger_name.trim(),
    trigger_table: trigger_table.trim(),
  };

  if (!trigger_table || !trigger_name || !action) {
    alert("llena todos los campos");
  } else {
    axios
      .patch("/triggers/trigger", data)
      .then((res) => {
        alert(res.data);
        window.location.replace("http://localhost:3000/triggers");
      })
      .catch((err) => {
        alert(err);
      });
  }

  console.log(data);
});
