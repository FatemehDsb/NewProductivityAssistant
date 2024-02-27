window.onload = () => {
  //Declaring username and password input
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");
  let todosContainer = document.getElementById("todosContainer");
  let quoteContainer = document.getElementById("quoteContainer");
  let apiUrl = "https://api.quotable.io/random";
  let fetchData;
  
  /*  >>>>>>>>> ==================Fatemeh's code starts Here============== <<<<<<<<<<<<< */
  //Get inputs 
 let  titleInput = document.getElementById("input-title");
 const deadlineInput = document.getElementById("deadline-input");
 const estimatedTimeInput = document.getElementById("estimated-time-input");
 const descriptionInput = document.getElementById("description-input");
 const todoStatusInput = document.querySelector('input[id="status-checkbox"]');

  let toDoList=[];

 /*  >>>>>>>>>================= Fatemeh's code ENDS Here ===================<<<<<<<<<<<<< */


  //Sharlin - Function for api greeting
  
  fetchData = async () => {
    const res = await fetch(apiUrl);
    const quote = await res.json();
    console.log(quote.content);
    console.log(`- ${quote.author}`);

    let finalquote = quote.content;
    let author = quote.author;
    let greeting = finalquote + "\n" + "- " + author;
    
    let quoteParagraph = document.createElement("p");
    quoteParagraph.innerText = greeting;
    quoteContainer.appendChild(quoteParagraph);
  }; //Fetch ends

  // Modal begins here

  // Get the modal
  const modal = document.getElementById("todoModal");

  // Get the button that opens the modal
  const openModalBtn = document.getElementById("openModalBtn");

  // Get the <span> element that closes the modal
  const modalSpan = document.getElementsByClassName("close")[0];

  
  // Btn onclick funktion
  let openModal = () => {
      modal.style.display = "block";
  };

  // When the user clicks the button, open the modal
  if (openModalBtn) {
      openModalBtn.onclick = openModal;
  }

  // When the user clicks on <span> (x), close the modal
  if (modalSpan) {
      modalSpan.onclick = function () {
          modal.style.display = "none";
      };
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
  }
};

  //declaring todo input
  // let todoInput = document.getElementById("todoInput");
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
   
   
    newUser = {
      id: userIdCounter,
      newUsername,
      newPassword,
      /* Fatemeh : deleted empty array*/
      toDoList,
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
  
  //Display greeting
  if (quoteContainer) {
      fetchData();
  }
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  if (currentUser && currentUser.toDoList && currentUser.toDoList.length > 0) {
      currentUser.toDoList.forEach((item) => {
      const todoLi = document.createElement("li");
       todoLi.textContent = item.title;
    if(todoUl){

      todoUl.appendChild(todoLi);
    }
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
  // const todoInputValue = todoInput.value
  /*  >>>>>>>>> Fatemeh's code STARTS Here <<<<<<<<<<<<< */
  //Get inputs 
  let title = titleInput.value;
  const categoryCheckbox = document.querySelector('input[name="category"]:checked');
  const category = categoryCheckbox ? categoryCheckbox.value: " ";
  const deadline = deadlineInput.value;
  const estimatedTime = estimatedTimeInput.value;
  const description = descriptionInput.value;
  const statusValue = todoStatusInput.checked;
  /*  >>>>>>>>> Fatemeh's code ENDS Here <<<<<<<<<<<<< */

    if (!title ) return;
  //   if (!todoInputValue ) return;


   let toDoItem = {
      title,
      category,
      deadline,
      estimatedTime,
      description,
      statusValue,
   }

  //  toDoList.push(todoItem);
  //  console.log(toDoList);

      /*  >>>>>>>>> Fatemeh's code ENDS Here <<<<<<<<<<<<< */

    const todoLi = document.createElement("li");
    todoLi.textContent = title;
    todoUl.appendChild(todoLi);

    // Get current user from localstorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Siri: Create a copy of currentUser to avoid modifying the original object
    const updatedUser = { ...currentUser };

    if (!updatedUser.toDoList) {
      updatedUser.toDoList = []; // Initialize toDoList if it does not exist
  }

    //Siri: previous version
    // currentUser.toDoList.push(todoInputValue);

    // Siri: Pushes todoInputValue to updatedUser (earlier currentUser)
    updatedUser.toDoList.push(toDoItem);

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

    titleInput.value = "";
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

//   console.log(currentUser);


//   