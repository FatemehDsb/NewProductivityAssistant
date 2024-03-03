window.onload = () => {
  //Declaring username and password input
  let usernameInput = document.getElementById("userName");
  let passwordInput = document.getElementById("password");
  let todosContainer = document.getElementById("todosContainer");
  let quoteContainer = document.getElementById("quoteContainer");
  let apiUrl = "https://api.quotable.io/random";
  let fetchData;
  let logOutBtn = document.getElementById("logOutBtn");
  let newUser;
  const addTodoBtn = document.getElementById("addTodoBtn");
  let registerBtn = document.getElementById("registerBtn");
  let completedTodosContainer = document.getElementById(
    "completedTodosContainer"
  );
  let arrowRight = document.querySelector(".arrow-right");
  let arrowDown = document.querySelector("arrow-down");

  //Get inputs
  let titleInput = document.getElementById("input-title");
  const deadlineInput = document.getElementById("deadline-input");
  const descriptionInput = document.getElementById("description-input");
  const todoStatusInput = document.querySelector('input[id="status-checkbox"]');
  let toDoList = [];

  function updateLocalStorage(updatedToDoList) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      currentUser.toDoList = updatedToDoList;
      console.log(currentUser.toDoList);
      registeredUsers = registeredUsers.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    } else {
      console.error("error");
    }
  }

  function convertToMinutes(hours, minutes) {
    return hours * 60 + minutes;
  }

  let renderToDoCard = (toDoItem) => {
    // Destructuring toDoItem for ease of use, including the category
    const {
      title,
      category,
      deadline,
      estimatedTime,
      description,
      statusValue,
    } = toDoItem;

    const todoCard = document.createElement("div");
    todoCard.classList.add("todo-card");

    todoCard.setAttribute("data-id", toDoItem.itemId); // Use the data-id attribute to store the unique ID

    const todoInfo = document.createElement("div");
    todoInfo.classList.add("todo-info");

    const todoTitleInfo = document.createElement("div");
    todoTitleInfo.classList.add("todo-title-info");

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;

    const todoBtn = document.createElement("div");
    todoBtn.classList.add("todo-btn");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pen" style="color: #ffffff;"></i>`;
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash" style="color: #ffffff;"></i>`;
    deleteBtn.classList.add("delete-btn");

    const todoDetails = document.createElement("div");
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

    //-----------------Status function starts here

    const statusElement = document.createElement("input");
    // statusElement.type = "checkbox"; //Fatemehs
    statusElement.setAttribute("type", "checkbox"); //Siris
    statusElement.classList.add("status-element");
    statusElement.checked = statusValue;
    // statusElement.addEventListener("change", () => { //Fatemehs

    statusElement.addEventListener("click", () => {
      //Siris
      // toDoItem.statusValue = statusElement.checked; //Fatemehs

      toDoItem.statusValue = !toDoItem.statusValue;

      statusElement.checked = toDoItem.statusValue;

      //if item has been checked before, move back item
      if (toDoItem.statusValue) {
        todoInfo.classList.add("completed-todo-info");
        todoInfo.classList.remove("todo-info");
        completedTodosContainer.prepend(todoCard);
      } else {
        todoInfo.classList.add("todo-info");
        todoInfo.classList.remove("completed-todo-info");
        todosContainer.append(todoCard);
      }

      // Saving to Local storage
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      let updatedToDoList = currentUser.toDoList.map((item) => {
        if (item.itemId === toDoItem.itemId) {
          // Update the specific key-value pair here
          item.statusValue = toDoItem.statusValue;
        }
        return item;
      });
      updateLocalStorage(updatedToDoList);
    });
    //-----------------Status function ends here

    // todocontainer=>todocard=>todoStatus + todoInfo (todoTitleInfo(todobtn+titleElement) + todoDetails)

    // Checking if saved toDoItem has statusValue == true or false
    // and putting it in "My todos" or "Completed todos" because of that
    if (toDoItem.statusValue === false) {
      todosContainer.appendChild(todoCard);
    } else {
      completedTodosContainer.appendChild(todoCard);
      todoInfo.classList.add("completed-todo-info");
    }

    todoCard.append(statusElement);
    todoCard.append(todoInfo);

    todoInfo.append(todoTitleInfo);
    todoInfo.append(todoDetails);
    todoInfo.append(todoDetails);

    todoTitleInfo.append(titleElement);
    todoTitleInfo.append(todoBtn);

    todoBtn.appendChild(editBtn);
    todoBtn.appendChild(deleteBtn);

    todoDetails.append(
      categoryElement,
      descriptionElement,
      estimatedTimeElement,
      deadlineElement
    );

    deleteBtn.style.width = "50px";
    editBtn.style.width = "50px";

    //*****************************************DELETE BUTTON*/
    deleteBtn.addEventListener("click", () => {
      todoCard.remove();
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      updatedToDoList = currentUser.toDoList.filter(
        (item) => item.itemId !== toDoItem.itemId
      );
      updateLocalStorage(updatedToDoList);
    });

    editBtn.addEventListener("click", () => {
      //i want that add to do items button opens
      addTodoBtn.addEventListener("click", () => {});
    });
  };

  // Api greeting
  let quoteParagraph = document.getElementById("quote");
  let authorParagraph = document.getElementById("author");

  fetchData = async () => {
    const res = await fetch(apiUrl);
    const quote = await res.json();
    console.log(quote.content);
    console.log(`- ${quote.author}`);

    let finalQuote = quote.content;
    let author = quote.author;
    //let greeting = finalquote + "\n" + "- " + author;

    quoteParagraph.innerText = finalQuote;
    authorParagraph.innerText = "- "+ author;
  };

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

  //when register user, it creates a new object called newuser.
  registerBtn?.addEventListener("click", () => {
    let newUsername = usernameInput.value;
    let newPassword = passwordInput.value;
    userIdCounter++;

    alert("User registered!");

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
      alert("Error: User not found");
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

  //----------------FILTRERING------------------------------------

  let checkBoxes = document.querySelectorAll("[name ='filterCategory']");

  checkBoxes.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
      todosContainer.innerHTML = "";
      completedTodosContainer.innerHTML = "";

      let selectedCategories = document.querySelectorAll(
        "[name ='filterCategory']:checked"
      );

      let pickedCategories = Array.from(selectedCategories).map(
        (box) => box.value
      );

      let filteredTodos = currentUser.toDoList.filter((todo) => {
        return pickedCategories.includes(todo.category);
      });

      filteredTodos.forEach((toDoItem) => {
        renderToDoCard(toDoItem);
      });
    });
  });

  //----------------FILTRERING SLUT-------------------------------
  //----------------SORTERING-------------------------------------

  const sortByDeadline = (order) => {
    const sortedTodos = currentUser.toDoList.slice().sort((a, b) => {
      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);
      return order === "asc" ? deadlineA - deadlineB : deadlineB - deadlineA;
    });
    console.log("Sorted by deadline:", sortedTodos);

    renderSortedTodos(sortedTodos);
  };

  const sortByEstimatedTime = (order) => {
    const sortedTodos = currentUser.toDoList.slice().sort((a, b) => {
      return order === "asc"
        ? a.estimatedTime - b.estimatedTime
        : b.estimatedTime - a.estimatedTime;
    });
    console.log("Sorted by estimated time:", sortedTodos);

    renderSortedTodos(sortedTodos);
  };

  const renderSortedTodos = (sortedTodos) => {
    todosContainer.innerHTML = "";
    completedTodosContainer.innerHTML = "";
    sortedTodos.forEach((todo) => renderToDoCard(todo));
  };

  const deadlineSortDropdown = document.getElementById("deadlineSortDropdown");
  deadlineSortDropdown?.addEventListener("change", () => {
    const order = deadlineSortDropdown.value;
    sortByDeadline(order, toDoList);
  });

  const estimatedTimeSortDropdown = document.getElementById(
    "estimatedTimeSortDropdown"
  );
  estimatedTimeSortDropdown?.addEventListener("change", () => {
    const order = estimatedTimeSortDropdown.value;
    sortByEstimatedTime(order, toDoList);
  });

  //----------------SORTERING-------------------------------------

  addTodoBtn?.addEventListener("click", () => {
    let title = titleInput.value;
    const categoryCheckbox = document.querySelector(
      'input[name="category"]:checked'
    );
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
      itemId: Date.now().toString(), // Unique ID for each to-do item
      title,
      category,
      deadline,
      estimatedTime,
      description,
      statusValue,
    };

    renderToDoCard(toDoItem);
    //**************************************************************************************** */
    // titleInput.value = "";  kommentera ut

    let registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      currentUser.toDoList.push(toDoItem);
      console.log(currentUser.toDoList);

      registeredUsers = registeredUsers.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    } else {
      console.error("error");
    }
    //}

    // //Create a copy of currentUser to avoid modifying the original object
    // const updatedUser = { ...currentUser };

    // if (!updatedUser.toDoList) {
    //   updatedUser.toDoList = []; // Initialize toDoList if it does not exist
    // }

    // //Pushes todoInputValue to updatedUser (earlier currentUser)
    // updatedUser.toDoList.push(toDoItem);

    // //Update registered users array with changes
    // const updatedRegisteredUsers = registeredUsers.map((user) =>
    //   user.id === updatedUser.id ? updatedUser : user
    // );

    // //Save the updatedUser to JSON string representing currentUser object in the Local Storage
    // localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // //Save the updated registered users array as JSON string to the registeredUsers array localStorage
    // localStorage.setItem(
    //   "registeredUsers",
    //   JSON.stringify(updatedRegisteredUsers)
    // );

    // Collect hours and minutes input for estimated time, convert to minutes

    titleInput.value = "";
    //////////////////////////////*****************2024-03-01******************************* */
    if (categoryCheckbox) {
      categoryCheckbox.checked = false;
    }
    deadlineInput.value = "";
    descriptionInput.value = "";
    todoStatusInput.checked = "";
    document.getElementById("estimatedTimeHours").value = "";
    document.getElementById("estimatedTimeMinutes").value = "";
  });
  //////////////////////////////*****************2024-03-01******************************* */

  // localStorage.clear();

  // Arrows hiding and showing Completed Todos container

  arrowRight.addEventListener("click", () => {
    completedTodosContainer.classList.add("hide-element");
  });

  arrowDown.addEventListener("click", () => {
    completedTodosContainer.classList.remove("hide-element");
  });

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
