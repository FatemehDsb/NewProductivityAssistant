window.onload = () => {
  //Declaring username and password input
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");
  let todosContainer = document.getElementById("todosContainer");
  //declaring todo input
  let todoInput = document.getElementById("todoInput");
  //declaring todo <ul>
  let todoUl = document.getElementById("todoUl");
  let logOutBtn = document.getElementById("logOutBtn");

  let newUser;

  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  let userIdCounter = localStorage.getItem("userIdCounter") || 0;

  let registerBtn = document.getElementById("registerBtn");

  //when register user, it creates a new object called newuser.
  registerBtn?.addEventListener("click", () => {
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

    localStorage.setItem("userIdCounter", userIdCounter);
    //save registeredusersarray in local storage
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    console.log("New user registered:", newUser); // Add this line to check newUser
  });

  //   localStorage.clear();

  let loginBtn = document.getElementById("loginBtn");
  loginBtn?.addEventListener("click", (event) => {
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

    //modified functions for todo ul
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user)); // Save current user
      window.location.assign("todo.html");
      console.log("assigned todo.html");
    } else {
      console.log("Error: User not found");
    }
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.toDoList && currentUser.toDoList.length > 0) {
    currentUser.toDoList.forEach((todoItem) => {
      const todoLi = document.createElement("li");
      todoLi.textContent = todoItem;
      todoUl.appendChild(todoLi);
    });
  }

  //function - to show currentusers.addtoList
  //when click on log in => localstorage.getitem("currentcuser") - userboject.todolist
  //if currentuser har todolistarray => om det inte finns, skapa ett tomt array
  //om det finns => append currentuser.todolist
  //create element li och sätta dem stringar
  //penda li i ul

  const addTodoBtn = document.getElementById("addTodoBtn");
  addTodoBtn?.addEventListener("click", () => {
    const todoInputValue = todoInput.value;
    if (!todoInputValue) return;

    const todoLi = document.createElement("li");
    todoLi.textContent = todoInputValue;
    todoUl.appendChild(todoLi);

    // Get current user from localstorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Siri: Create a copy of currentUser to avoid modifying the original object
    const updatedUser = { ...currentUser };

    //Siri: previous version
    // currentUser.toDoList.push(todoInputValue);

    // Siri: Pushes todoInputValue to updatedUser (earlier currentUser)
    updatedUser.toDoList.push(todoInputValue);

    // Siri: Previous version: Update registered users array with changes
    // registeredUsers = registeredUsers.map((user) =>
    //   user.id === currentUser.id ? currentUser : user
    // );

    // Siri: Update registered users array with changes
    const updatedRegisteredUsers = registeredUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    // Siri: previous version: Save the updated registered users array to localStorage
    // localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    // Siri: Save the updatedUser to JSON string representing currentUser object in the Local Storage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Siri: Save the updated registered users array as JSON string to the registeredUsers array localStorage
    localStorage.setItem(
      "registeredUsers",
      JSON.stringify(updatedRegisteredUsers)
    );

    todoInput.value = "";
  });

  // localStorage.clear();

  // Checking if the element logOutBtn exists in the HTML file
  if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
      // Moves the user to the first page
      window.location.assign("index.html");
      // Empties the currentUser array
      localStorage.removeItem("currentUser");
    });
  }
};
