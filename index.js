window.addEventListener("DOMContentLoaded", (event) => {
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");

  let todoInput = document.getElementById("todoInput");
  let todoUl = document.getElementById("todoUl");
  let toDoList;

  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  let userIdCounter = localStorage.getItem("userIdCounter") || 0;

  let registerBtn = document.getElementById("registerBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      let newUsername = usernameInput.value;
      let newPassword = passwordInput.value;
      let id;

      userIdCounter++;

      let newUser = {
        id: userIdCounter,
        newUsername,
        newPassword,
        id,
        toDoList: []
      };

      registeredUsers.push(newUser);

      localStorage.setItem("userIdCounter", userIdCounter);

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    });
  }
  //   localStorage.clear();

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
      toDoList = JSON.parse(localStorage.getItem("toDoList")) || []; 
      let todoInputValue = todoInput.value;

      //toDoList.forEach(user => {

      let todoLi = document.createElement("li");
      todoLi.textContent = todoInputValue;
      todoUl.append(todoLi);
      

      toDoList.push(todoLi.textContent);

      localStorage.setItem("toDoList", JSON.stringify(toDoList));

      //registeredUsers.push(toDoList);
      console.log(registeredUsers);
      
    });

    };
  
});
