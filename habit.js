window.onload = () => {
  let logOutBtn = document.getElementById("logOutBtn");
  const addHabitBtn = document.getElementById("addHabitBtn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const saveBtn = document.getElementById("saveHabitBtn");

  //Get inputs
  let titleInput = document.getElementById("input-title");
  const priorityInput = document.getElementById("priorityInput");

  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  let userIdCounter = localStorage.getItem("userIdCounter") || 0;

  function updateLocalStorage(updatedHabitList) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      currentUser.habitList = updatedHabitList;
      console.log(currentUser.habitList);
      registeredUsers = registeredUsers.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    } else {
      console.error("error");
    }
  }

  let renderHabitCard = (habitItem) => {
    // Destructuring habitItem for ease of use, including the category
    const { title, priority, streak } = habitItem;

    const habitCard = document.createElement("div");
    habitCard.classList.add("habit-card");

    habitCard.setAttribute("data-id", habitItem.itemId); // Use the data-id attribute to store the unique ID

    const habitPriorityCover = document.createElement("div");
    if (priority == "high") {
      habitPriorityCover.innerText = "PRIORITY: HIGH";
      habitPriorityCover.classList.add("habit-priority-high-cover");
    } else if (priority == "medium") {
      habitPriorityCover.innerText = "PRIORITY: MEDIUM";
      habitPriorityCover.classList.add("habit-priority-medium-cover");
    } else if (priority == "low") {
      habitPriorityCover.innerText = "PRIORITY: LOW";
      habitPriorityCover.classList.add("habit-priority-low-cover");
    }

    const habitInfo = document.createElement("div");
    habitInfo.classList.add("habit-info");

    const habitTitleInfo = document.createElement("div");
    habitTitleInfo.classList.add("habit-title-info");

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;

    const priorityElement = document.createElement("div");
    priorityElement.classList.add("priority-element");
    priorityElement.textContent = priority;

    const streakElement = document.createElement("div");
    streakElement.classList.add("streak-element");
    //streakElement.textContent = streak;

    const habitBtn = document.createElement("div");
    habitBtn.classList.add("habit-btn");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pen" style="color: #ffffff;"></i>`;
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash" style="color: #ffffff;"></i>`;
    deleteBtn.classList.add("delete-btn");

    const habitDetails = document.createElement("div");
    habitDetails.classList.add("habit-details");

    
    //-------------STREAK STARTS---------------
  
    streakElement.textContent = "Streak: " + (streak || 0);

    const streakCheckbox = document.createElement("input");
    streakCheckbox.setAttribute("type", "checkbox");
    let streakCounter = 0;

    const streakText = document.createElement('span');
    streakText.textContent = `Current Streak: ${streakCounter}`;

    const updateStreak = () => {
        streakCounter++;
        streakText.textContent = `Streak: ${streakCounter}`;
    };

    streakCheckbox.addEventListener('click', () => {
        updateStreak();
    });

    streakElement.appendChild(streakCheckbox);
    streakElement.appendChild(streakText);
    habitDetails.appendChild(streakElement);
    habitCard.appendChild(habitDetails);

    //-------------STREAK ENDS---------------

    // Saving to Local storage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let updatedHabitList = currentUser.habitList.map((item) => {
      if (item.itemId === habitItem.itemId) {
        // Update the specific key-value pair here
        item.statusValue = habitItem.statusValue;
      }
      return item;
    });
    updateLocalStorage(updatedHabitList);

    habitCard.append(habitPriorityCover);
    habitCard.append(habitInfo);

    habitInfo.append(habitTitleInfo);
    habitInfo.append(habitDetails);
    habitInfo.append(habitDetails);

    habitTitleInfo.append(titleElement);
    habitTitleInfo.append(habitBtn);

    habitBtn.appendChild(editBtn);
    habitBtn.appendChild(deleteBtn);

    habitDetails.append(streakElement);

    deleteBtn.style.width = "50px";
    editBtn.style.width = "50px";
    habitContainer.appendChild(habitCard);

    //*****************************************DELETE BUTTON*/
    deleteBtn.addEventListener("click", () => {
      habitCard.remove();
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      updatedHabitList = currentUser.habitList.filter(
        (item) => item.itemId !== habitItem.itemId
      );
      updateLocalStorage(updatedHabitList);
    });

    editBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const editHabitItem = currentUser.habitList.find(
        (item) => item.itemId === habitItem.itemId
      );
      if (!editHabitItem) return;

      //
      titleInput.value = editHabitItem.title;

      //
      modal.style.display = "block";
      addHabitBtn.style.display = "none";

      saveBtn.style.display = "block";

      //
      saveBtn.onclick = () => {
        saveHabitChanges(editHabitItem.itemId);
        modal.style.display = "none";
      };
    });
  };

  if (
    currentUser &&
    currentUser.habitList &&
    currentUser.habitList.length > 0
  ) {
    currentUser.habitList.forEach((habitItem) => {
      renderHabitCard(habitItem);
    });
  }

  // Modal begins here
  // Get the modal
  const modal = document.getElementById("habitModal");

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

  addHabitBtn?.addEventListener("click", () => {
    let title = titleInput.value;
    let priority = priorityInput.value;
    let streak;

    if (!title) return;

    let habitItem = {
      itemId: Date.now().toString(), // Unique ID for each habit item
      title,
      priority,
      streak,
    };

    //Create a copy of currentUser to avoid modifying the original object
    const updatedUser = { ...currentUser };

    if (!updatedUser.habitList) {
      updatedUser.habitList = []; // Initialize habitList if it does not exist
    }

    //Pushes habitInputValue to updatedUser (earlier currentUser)
    updatedUser.habitList.push(habitItem);

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

    renderHabitCard(habitItem);
  });

  if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
      // Moves the user to the first page
      window.location.assign("index.html");
      // Empties the currentUser array
      localStorage.removeItem("currentUser");
    });
  }

  //----------------FILTRERING------------------------------------//

  let priorityFilter = document.getElementById("priorityFilterDropdown");
  priorityFilter?.addEventListener("change", () => {
    let selectedPriority = priorityFilter.value;

    //   for (let i = 0; i < currentUser.habitList.length; i++) {
    //     if (currentUser.habitList[i].priority === selectedPriority) {
    //         filteredHabits.push(currentUser.habitList[i]);
    //     }
    // }

    let filteredHabits = currentUser.habitList.filter((habitItem) => {
      return habitItem.priority === selectedPriority;
    });

    const habitContainer = document.getElementById("habitContainer");
    habitContainer.innerHTML = "";

    filteredHabits.forEach((habitItem) => {
      renderHabitCard(habitItem);
    });
  });
  //----------------FILTRERING SLUT ------------------------------------//

  //----------------SORTERING------------------------------------------//

  //sorting by priority

  const priorityValues = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  //sorting function
  let sortedHabitsByPriority = (order) => {
    currentUser.habitList.sort((a, b) => {
      // Get numerical priority values for comparison
      //for each habit, (a), find its priority level, and then look at the number value in priorityvaluse objects
      let priorityA = priorityValues[a.priority];
      let priorityB = priorityValues[b.priority];

      return priorityA - priorityB;
    });
  };

  //get value of selected dropdown
  let prioritySortDropdown = document.getElementById("prioritySortDropdown");
  prioritySortDropdown?.addEventListener("change", () => {
    sortedHabitsByPriority();
  });
};
