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

  const saveBtn = document.getElementById("saveTodoBtn");
  //Get inputs
  let titleInput = document.getElementById("input-title");
  const deadlineInput = document.getElementById("deadline-input");
  const descriptionInput = document.getElementById("description-input");
  const todoStatusInput = document.querySelector('input[id="status-checkbox"]');
  let toDoList = [];
  let habitList = [];

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

  /**********FUNCTION TO SAVE CHANGES ************************ */

  function saveTodoChanges(itemId) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let editedTodoItem = currentUser.toDoList.find(
      (item) => item.itemId === itemId
    );
    if (editedTodoItem) {
      //
      editedTodoItem.title = titleInput.value;
      const checkedCategoryInput = document.querySelector(
        'input[name="category"]:checked'
      );
      if (checkedCategoryInput) {
        editedTodoItem.category = checkedCategoryInput.value;
      }

      editedTodoItem.deadline = deadlineInput.value;
      editedTodoItem.estimatedTime =
        (parseInt(document.getElementById("estimatedTimeHours").value) || 0) *
          60 +
        (parseInt(document.getElementById("estimatedTimeMinutes").value) || 0);
      editedTodoItem.description = descriptionInput.value;
      editedTodoItem.statusValue = todoStatusInput.checked;

      //
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem(
        "registeredUsers",
        JSON.stringify(
          registeredUsers.map((user) =>
            user.id === currentUser.id ? currentUser : user
          )
        )
      );

      //
      modal.style.display = "none";

      /*Siris radera?
      //
      todosContainer.innerHTML = "";
      completedTodosContainer.innerHTML = "";
      currentUser.toDoList.forEach((todoItem) => {
*/

      todosContainer.innerHTML = "";
      completedTodosContainer.innerHTML = "";

      currentUser.toDoList.forEach((editedTodoItem) => {
        renderToDoCard(editedTodoItem);
      });
    } else {
      console.error("Todo item not found.");
    }
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

    const todoCardCoverContainer = document.createElement("div");
    todoCardCoverContainer.classList.add("todo-card-cover-container");

    const todoCard = document.createElement("div");
    todoCard.classList.add("todo-card");

    todoCard.setAttribute("data-id", toDoItem.itemId); // Use the data-id attribute to store the unique ID

    const todoCategoryCover = document.createElement("div");
    todoCategoryCover.classList.add("todo-category-cover");
    if (category == "General") {
      todoCategoryCover.innerHTML = `<div>CATEGORY: GENERAL</div> <div>${deadline}</div>`;
    } else if (category == "Shopping") {
      todoCategoryCover.innerText = "CATEGORY: SHOPPING" + deadline;
    } else if (category == "Health") {
      todoCategoryCover.innerText = "CATEGORY: HEALTH" + deadline;
    } else if (category == "Home") {
      todoCategoryCover.innerText = "CATEGORY: HOME" + deadline;
    } else if (category == "Work") {
      todoCategoryCover.innerText = "CATEGORY: WORK" + deadline;
    }

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

    // const deadlineElement = document.createElement("p");
    // deadlineElement.textContent = `Deadline: ${deadline}`;

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
    todoCard.append(todoCardCoverContainer);

    todoCardCoverContainer.append(todoCategoryCover);
    todoCardCoverContainer.append(todoInfo);

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
      estimatedTimeElement
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

    editBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      //
      modal.style.display = "block";
      addTodoBtn.style.display = "none";
      saveBtn.style.display = "block";
      //
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const editedTodoItem = currentUser.toDoList.find(
        (item) => item.itemId === toDoItem.itemId
      );
      if (!editedTodoItem) return;
      //
      titleInput.value = editedTodoItem.title;

      //
      const categoryInput = document.querySelector(
        'input[name="category"][value="' + editedTodoItem.category + '"]'
      );

      //
      if (categoryInput) {
        categoryInput.checked = true;
      }

      deadlineInput.value = editedTodoItem.deadline;
      document.getElementById("estimatedTimeHours").value = Math.floor(
        editedTodoItem.estimatedTime / 60
      );
      document.getElementById("estimatedTimeMinutes").value =
        editedTodoItem.estimatedTime % 60;
      descriptionInput.value = editedTodoItem.description;
      todoStatusInput.checked = editedTodoItem.statusValue;

      saveBtn.onclick = () => {
        saveTodoChanges(editedTodoItem.itemId);
        /*********************Nullställa alla input fält- nullställa hela modalen? */
        //when we click on savebutton, it deletes all input fields, it should
        const checkedCategoryInput = document.querySelector(
          'input[name="category"]:checked'
        );
        if (checkedCategoryInput) {
          checkedCategoryInput.checked = false;
        }
        titleInput.value = "";
        deadlineInput.value = "";
        descriptionInput.value = "";
        todoStatusInput.checked = "";
        document.getElementById("estimatedTimeHours").value = "";
        document.getElementById("estimatedTimeMinutes").value = "";
        modal.style.display = "none";
        addTodoBtn.style.display = "block";
        saveBtn.style.display = "none";
        //*****************************Jag behöver nollställa modal efter click på save eller innan öpp */
      };
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

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userName = currentUser ? currentUser.newUsername : "Guest";

    quoteParagraph.innerText = `Hello, ${userName}! \n${finalQuote}`;
    authorParagraph.innerText = " - " + author;

    //Set timeout and remove quoteContainer after 30 sec
    setTimeout(() => {
      if (quoteContainer) {
        quoteContainer.classList.add("fade-quote");
        setTimeout(() => {
          quoteContainer.style.display = "none";
        }, 1000);
      }
    }, 10000); //10 seconds
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
    saveBtn.style.display = "none";
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

    let userNameExist = registeredUsers.find(
      (user) => newUsername === user.newUsername
    );
    if (userNameExist) {
      alert("Username already exists");
    } else {
      alert("User registered!");
    }

    newUser = {
      id: userIdCounter,
      newUsername,
      newPassword,
      toDoList,
      habitList,
    };

    registeredUsers.push(newUser);

    localStorage.setItem("userIdCounter", userIdCounter);

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    console.log("New user registered:", newUser);
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
  let selectAll = document.getElementById("selectAll");

  // Eventlistener for the "All"-checkbox with the instruction that if
  // this checkbox is checked, all other checkboxes (checkBoxes) should also be checked.

  selectAll?.addEventListener("change", () => {
    checkBoxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;

      updateTodos();
    });
  });

  // Rendering of checkBoxes and adding eventlistener which has a variable (allChecked)
  // that is only "true" if all checkboxes are checked, and if so, the "All" checkbox
  // should also be checked. If all checkboxes are NOT checked, "All" should not be.

  checkBoxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(checkBoxes).every((box) => box.checked);
      selectAll.checked = allChecked;

      updateTodos();
    });
  });

  // The function that renders the cards depending on what filter checkbox/es are checked.

  const updateTodos = () => {
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
  };

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
    addTodoBtn.style.display = "block";
    saveBtn.style.display = "none";

    //******************************************************************************* */

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

    // let registeredUsers =
    //   JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // if (currentUser.toDoList) {
    //   currentUser.toDoList.push(toDoItem);
    //   console.log(currentUser.toDoList);

    //   registeredUsers = registeredUsers.map((user) =>
    //     user.id === currentUser.id ? currentUser : user
    //   );

    //   localStorage.setItem("currentUser", JSON.stringify(currentUser));
    //   localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    // } else {
    //   console.error("error");
    // }

    //Create a copy of currentUser to avoid modifying the original object
    const updatedUser = { ...currentUser };

    if (!updatedUser.toDoList) {
      updatedUser.toDoList = []; // Initialize toDoList if it does not exist
    }

    //Pushes todoInputValue to updatedUser (earlier currentUser)
    updatedUser.toDoList.push(toDoItem);

    //Update registered users array with changes
    const updatedRegisteredUsers = registeredUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    //Save the updatedUser to JSON string representing currentUser object in the Local Storage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    //Save the updated registered users array as JSON string to the registeredUsers array localStorage
    localStorage.setItem(
      "registeredUsers",
      JSON.stringify(updatedRegisteredUsers)
    );

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

  let arrowRight = document.getElementById("arrowRight");
  let arrowDown = document.getElementById("arrowDown");
  if (arrowRight) {
    arrowRight.style.display = "none";

    arrowRight?.addEventListener("click", () => {
      completedTodosContainer.classList.remove("hide-element");
      arrowRight.style.display = "none";
      arrowDown.style.display = "inline";
    });
  }

  if (arrowDown) {
    arrowDown?.addEventListener("click", () => {
      completedTodosContainer.classList.add("hide-element");
      arrowDown.style.display = "none";
      arrowRight.style.display = "inline";
    });
  }

  // Checking if the element logOutBtn exists in the HTML file
  if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
      // Moves the user to the first page
      window.location.assign("index.html");
      // Empties the currentUser array
      localStorage.removeItem("currentUser");
    });
  }

  // POMODORA Modal begins here ----------------------------------------
  const openPomodoroModalBtn = document.getElementById("openPomodoroBtn");
  const pomodoroModal = document.getElementById("pomodoroModal");
  const pomodoroModalSpan =
    document.getElementsByClassName("pomodoro-close")[0];

  if (openPomodoroModalBtn) {
    openPomodoroModalBtn.onclick = function () {
      pomodoroModal.style.display = "block";
    };
  }
  if (pomodoroModalSpan) {
    pomodoroModalSpan.onclick = function () {
      pomodoroModal.style.display = "none";
    };
  }

  const timerDisplay = document.querySelector(".timer-display");
  const startButton = document.querySelector(".timer-start");
  const pauseButton = document.querySelector(".timer-pause");
  const stopButton = document.querySelector(".timer-stop");
  const timerInput = document.getElementById("timerTime"); //timer input
  let countdown; // countdown timer
  let timeLeft;

  //start timer
  startButton?.addEventListener("click", () => {
    //Medan timer är igång, dölj allt annat på sidan förutom tillhörande-knappar och tiden.
    // När tiden är pausad eller stoppad, ska allt annat på sidan kunna visas.

    pomodoroModal.style.background = "white";
    clearInterval(countdown);

    let timerValue = timerInput.value;
    const durationInSeconds = parseInt(timerValue) * 60; //convert input value to seconds
    timeLeft = durationInSeconds;

    if (isNaN(durationInSeconds)) {
      //JavaScript function  "is Not a Number."
      alert("invalid number.");
      return;
    }

    clearInterval(countdown); //Clears any ongoing countdown (to ensure only one timer runs at a time).

    //displaying userInput- timerInput
    const minutes = Math.floor(timeLeft / 60);
    const remainingSeconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
    //displaying-END

    //Sets up a countdown that decreases every second.
    countdown = setInterval(() => {
      timeLeft -= 1;
      //updated display time
      const minutes = Math.floor(timeLeft / 60);
      const remainingSeconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
      //displaying-END

      if (timeLeft <= 0) {
        // Stop the timer when it reaches 0
        clearInterval(countdown); //stopping the timer.
      }
    }, 1000); // Update every 1000 milliseconds/1 second.
  });

  //stop button

  /* Siri saving this just to be sure - MERGE CONFLICT

  stopButton.addEventListener("click", () => {
    clearInterval(countdown);
    timeLeft = 0;
    //updated display time
    const minutes = Math.floor(timeLeft / 60);
    const remainingSeconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
*/

  stopButton?.addEventListener("click", () => {
    pomodoroModal.style.background = "white";
    clearInterval(countdown);
    timeLeft = 0;
    // //updated display time
    // const minutes = Math.floor(timeLeft/60);
    // const remainingSeconds = timeLeft % 60;
    timerDisplay.textContent = "0:00";
    timerInput.value = "";
    timerInput.disabled = false;
  });

  let isPaused = false;
  pauseButton?.addEventListener("click", () => {
    if (!isPaused) {
      clearInterval(countdown); // Pause the timer
      pauseButton.innerHTML = "Resume";
      isPaused = true;
    } else {
      // Resume the timer
      isPaused = false;
      pauseButton.innerHTML = "Pause";
      countdown = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(countdown); // Stop the timer if time runs out
          pauseButton.innerHTML = "Pause"; // Reset button text
          isPaused = false; // Reset pause state
        } else {
          timeLeft -= 1; // Decrement the time left by one second
          //displaying userInput- timerInput
          const minutes = Math.floor(timeLeft / 60);
          const remainingSeconds = timeLeft % 60;
          timerDisplay.textContent = `${minutes}:${
            remainingSeconds < 10 ? "0" : ""
          }${remainingSeconds}`;
          //
        }
      }, 1000); // Update every second
      isPaused = false;
    }
  });
  // POMODORA Modal end here ----------------------------------------
};
