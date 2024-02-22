//Declaring username and password input
let usernameInput = document.getElementById("userName");
let passwordInput = document.getElementById("password");
let todosContainer = document.getElementById("todosContainer");
//declaring todo input
let todoInput = document.getElementById("todoInput");
//declaring todo <ul>
let todoUl = document.getElementById("todoUl");
let logOutBtn = document.getElementById("logOutBtn");

//Declaring todoList array
let toDoList;

let newUser;
let currentUser;

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
let userIdCounter = localStorage.getItem("userIdCounter") || 0;

let registerBtn = document.getElementById("registerBtn");

//when register user, it creates a new object called newuser.
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    let newUsername = usernameInput.value;
    let newPassword = passwordInput.value;
    userIdCounter++;
    //*****change newUserName to userName
    newUser = {
      id: userIdCounter,
      newUsername,
      newPassword,
      toDoList: [],
    };
    //add new object to registeredusers array.
    registeredUsers.push(newUser);

    // localStorage.setItem("userIdCounter", userIdCounter);
    //save registeredusersarray in local storage
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    console.log("New user registered:", newUser); // Add this line to check newUser
  });
}
//   localStorage.clear();

let loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let userName = usernameInput.value;
    let password = passwordInput.value;

    //temporarily variable within scope of login function

    let user = registeredUsers.find(
      (user) => user.newUsername === userName && user.newPassword === password
    );

    //Fatemeh Comment :
    //if the user variable finds a match in the registeredUsers array
    //set currentUser to reference this user
    //currentUser's data is stored in localStorage using user's details.
    //key : currentUser - value: currentuserObject-string

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user)); // Save current user
      window.location.assign("todo.html");
      console.log("success");
      currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        //if there is anything in array
        if (currentUser.toDoList.length > 0) {
          console.log(currentUser.toDoList);
          currentUser.toDoList.forEach((todoItems) => {
            let todoLi = document.createElement("li");
            todoLi.textContent = todoItems;
            console.log(todoUl);
            todoUl.appendChild(todoLi);
          });
        } else {
          console.log("error");
        }
      } else {
        console.log("No user");
      }
    } else {
      console.log("fail");
    }
  });

  //function - to show currentusers.addtoList
  //when click on log in => localstorage.getitem("currentcuser") - userboject.todolist
  //if currentuser har todolistarray => om det inte finns, skapa ett tomt array
  //om det finns => append currentuser.todolist
  //create element li och sätta dem stringar
  //penda li i ul
}

let addTodoBtn = document.getElementById("addTodoBtn");
if (addTodoBtn) {
  addTodoBtn.addEventListener("click", () => {
    let todoInputValue = todoInput.value;
    //check if there is any inputvalue
    if (todoInputValue) {
      currentUser = JSON.parse(localStorage.getItem("currentUser"));
      // Retrieve the current user
      // Find and update the current user's toDoList in registeredUsers
      //Assigning the result of .map() back to registeredUsers
      //effectively updates the entire array with any changes made during the .map()
      registeredUsers = registeredUsers.map((user) => {
        if (user.id === currentUser.id) {
          if (!user.toDoList) user.toDoList = []; // Ensure toDoList exists
          user.toDoList.push(todoInputValue);
          currentUser = user; // Update currentUser with the new toDoList
        }
        return user;
      });

      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers)); // Save updated users
      localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Update current user in storage

      // Add the to-do item to the DOM
      let todoLi = document.createElement("li");
      todoLi.textContent = todoInputValue;
      todoUl.appendChild(todoLi);
    }
  });
}

// localStorage.clear();

// Checking if the element logOutBtn exists in the HTML file
if (logOutBtn) {
  // Event Listener
  logOutBtn.addEventListener("click", () => {
    // Moves the user to the first page
    window.location.assign("index.html");

    // Empties the currentUser array
    currentUser = [];

    // Updates the current user in Local storage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  });
}
