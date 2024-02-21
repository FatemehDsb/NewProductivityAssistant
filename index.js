// window.addEventListener("DOMContentLoaded", () => {
let usernameInput = document.getElementById("userName");
let passwordInput = document.getElementById("password");

let todoInput = document.getElementById("todoInput");
let todoUl = document.getElementById("todoUl");
let toDoList;

let newUser;
let currentUser;

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
let userIdCounter = localStorage.getItem("userIdCounter") || 0;

let registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    let newUsername = usernameInput.value;
    let newPassword = passwordInput.value;

    userIdCounter++;

    newUser = {
      id: userIdCounter,
      newUsername,
      newPassword,
      toDoList: [],
    };

    registeredUsers.push(newUser);

    localStorage.setItem("userIdCounter", userIdCounter);

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    console.log("New user registered:", newUser); // Add this line to check newUser
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

    // if (user) {
    //   window.location.assign("todo.html"), console.log("success");
    // } else {
    //   console.log("fail");
    // }

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user)); // Save current user
      window.location.assign("todo.html");
      console.log("success");
    } else {
      console.log("fail");
    }
  });
}

let addTodoBtn = document.getElementById("addTodoBtn");
if (addTodoBtn) {
  addTodoBtn.addEventListener("click", () => {
    // Retrieve the current user
    currentUser = JSON.parse(localStorage.getItem("currentUser"));

    toDoList = JSON.parse(localStorage.getItem("toDoList")) || [];
    let todoInputValue = todoInput.value;

    //toDoList.forEach(user => {

    let todoLi = document.createElement("li");
    todoLi.textContent = todoInputValue;
    todoUl.append(todoLi);

    toDoList.push(todoLi.textContent);

    registeredUsers.forEach((user) => {
      if (user.id === currentUser.id) {
        currentUser = user;
        registeredUsers.push(toDoList);
      }
    });

    if (currentUser !== null) {
      console.log("Önskat objekt:", currentUser);
      console.log("Önskat id:", currentUser.id);
    } else {
      console.log("Objekt med önskat id hittades inte.");
    }

    // Kod att ev använda om vi ska spara till Local Storage här:

    // if (
    //   currentUser &&
    //   registeredUsers.newUser &&
    //   currentUser.id === registeredUsers[0].id
    // ) {
    //   localStorage.setItem("toDoList", JSON.stringify(toDoList));
    // }
    console.log(registeredUsers);
  });
}
// });
