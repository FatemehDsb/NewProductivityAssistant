window.addEventListener("DOMContentLoaded", (event) => {
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");

  let todoInput = document.getElementById("todoInput");
  let todoUl = document.getElementById("todoUl");

  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  let registerBtn = document.getElementById("registerBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      let newUsername = usernameInput.value;
      let newPassword = passwordInput.value;

      let newUser = {
        newUsername,
        newPassword,
      };

      registeredUsers.push(newUser);

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    });
  }
  //localStorage.clear();

  let loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      let userName = usernameInput.value;
      let password = passwordInput.value;

      let user = registeredUsers.find(
        (user) => user.newUsername === userName && user.newPassword === password
      );

      if (user) {
        window.location.assign("todo.html"), console.log("success");
      } else {
        console.log("fail");
      }
    });
  }

  let addTodoBtn = document.getElementById("addTodoBtn");
  if (addTodoBtn) {
    addTodoBtn.addEventListener("click", () => {
      let todoInputValue = todoInput.value;
      let todoLi = document.createElement("li");
      todoLi.innerHTML = todoInputValue;
      todoUl.append(todoLi);
    });
  }
});
