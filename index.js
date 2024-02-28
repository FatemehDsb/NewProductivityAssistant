window.onload = () => {
  //Declaring username and password input
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");
  let todosContainer = document.getElementById("todosContainer");
  let quoteContainer = document.getElementById("quoteContainer");
  let apiUrl = "https://api.quotable.io/random";
  let fetchData;
  // let todoUl = document.getElementById("todoUl");
  let logOutBtn = document.getElementById("logOutBtn");
  let newUser;
  
  //Get inputs 
 let  titleInput = document.getElementById("input-title");
 const deadlineInput = document.getElementById("deadline-input");
 const descriptionInput = document.getElementById("description-input");
 const todoStatusInput = document.querySelector('input[id="status-checkbox"]');
let toDoList=[];
 
function updateLocalStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}
function convertToMinutes(hours, minutes) {
    return hours * 60 + minutes;
  }

  let renderToDoCard = (toDoItem) => {
    // Destructuring toDoItem for ease of use, including the category
    const { title,category, deadline, estimatedTime, description, statusValue } = toDoItem;
     
    const todoCard = document.createElement("div");
    todoCard.classList.add("todo-card");

    todoCard.setAttribute('data-id', toDoItem.itemId); // Use the data-id attribute to store the unique ID

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;

    const todoDetails=  document.createElement("div");
    todoDetails.classList.add("todo-details");

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;

    // Assuming estimatedTime is in minutes, converting to a more readable format
    const hours = Math.floor(estimatedTime / 60);
    const minutes = estimatedTime % 60;
    const estimatedTimeElement = document.createElement("p");
    estimatedTimeElement.textContent = `${hours}h ${minutes}m`;

    const deadlineElement = document.createElement("p");
    deadlineElement.textContent = `Deadline: ${deadline}`;

    const categoryElement = document.createElement("p");
    categoryElement.textContent = `Category: ${category}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    
    const statusElement = document.createElement("input");
    statusElement.type = "checkbox";
    statusElement.checked = statusValue;
    statusElement.addEventListener('change', () => {
      toDoItem.statusValue = statusElement.checked;
      updateTodoInStorage(toDoItem);
    });
    
    todosContainer.appendChild(todoCard);
    todoCard.append(titleElement)
    todoCard.append(todoDetails)
    todoCard.appendChild(editBtn)
    todoCard.appendChild(deleteBtn);
    todoDetails.append(descriptionElement, estimatedTimeElement, deadlineElement, categoryElement, statusElement);
    
    deleteBtn.addEventListener("click", ()=>{
      todoCard.remove();  
      // Remove the to-do item from the toDoList array using the unique ID
      toDoList = toDoList.filter(item => item.itemId !== toDoItem.itemId);
      updateLocalStorage();
    });
  };

  
 // Placeholder for updateTodoInStorage function
 function updateTodoInStorage(updatedToDoItem) {
  // Implement logic to update the todo item in your storage mechanism (e.g., localStorage)
  console.log("Updated todo item in storage:", updatedToDoItem);
  // This could involve finding the item in an array, updating it, and then saving the array back to localStorage
}

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
      currentUser.toDoList.forEach((toDoItem) => {
        renderToDoCard(toDoItem);
  });
}


const addTodoBtn = document.getElementById("addTodoBtn");

  addTodoBtn.addEventListener("click", () => {
    let title = titleInput.value;
    const categoryCheckbox = document.querySelector('input[name="category"]:checked');
    let category = categoryCheckbox ? categoryCheckbox.value : "General"; // Default category if none selected
    let deadline = deadlineInput.value;

    // Collect hours and minutes input for estimated time, convert to minutes
    let hoursInput = document.getElementById("estimatedTimeHours").value;
    let minutesInput = document.getElementById("estimatedTimeMinutes").value;

    let hours = parseInt(hoursInput) || 0;
    let minutes = parseInt(minutesInput) || 0;

    let estimatedTime = convertToMinutes(hours, minutes);

    let description = descriptionInput.value;
    let statusValue = todoStatusInput.checked;

    if (!title) return;
    
    let toDoItem = {
      itemId:Date.now().toString(), // Unique ID for each to-do item
      title,
      category,
      deadline,
      estimatedTime,
      description,
      statusValue,
    };

    renderToDoCard(toDoItem);
    titleInput.value = "";
 
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