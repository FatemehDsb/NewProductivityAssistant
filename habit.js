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

  /**********FUNCTION TO SAVE CHANGES ************************ */

  function saveHabitChanges(itemId) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let editedHabitItem = currentUser.habitList.find(
      (item) => item.itemId === itemId
    );
    if (editedHabitItem) {
      //
      editedHabitItem.title = titleInput.value;
      const editStreakInput = document.getElementById("editStreakInput"); 
      editedHabitItem.streak=editStreakInput.value;
      editedHabitItem.priority=priorityInput.value

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

      habitContainer.innerHTML = "";

      currentUser.habitList.forEach((editedHabitItem) => {
        renderHabitCard(editedHabitItem);
      });
    } else {
      console.error("Habit item not found.");
    }
  }

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
    const { title, priority, streak, lastCheckedDate} = habitItem;

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
    } else {
      habitPriorityCover.innerText = "PRIORITY: None";
      habitPriorityCover.classList.add("habit-priority-none-cover");
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

    // const streakElement = document.createElement("div");
    // streakElement.classList.add("streak-element");
    // streakElement.textContent = streak;

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

 


     const streakCheckbox = document.createElement("input");
     streakCheckbox.setAttribute("type", "checkbox");
     const showStreak = document.createElement("p");
     showStreak.textContent=streak;

     habitDetails.append(streakCheckbox);
     habitDetails.append(showStreak);

     //when page loads, check if todaysdate equal to habititem.lastcheckeddate, if user has already checked in today, disabled checkbox, and leave checkbox , checked.
     let initialDate = new Date().toISOString().split('T')[0];
     if (habitItem.lastCheckedDate === initialDate) {
    streakCheckbox.checked = true;
    streakCheckbox.disabled = true;
}
     
     streakCheckbox?.addEventListener("click", () => {
       
       if (streakCheckbox.checked) {
         //03-08**********************
       
         let currentUser = JSON.parse(localStorage.getItem("currentUser"));
         let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
         
         //find the currentuser.habitlist.habititem that user has clicked on its checkbox and then update the currentuser with new streak
         if(currentUser && currentUser.habitList){
           let currentDate = new Date().toISOString().split('T')[0];

           currentUser.habitList = currentUser.habitList.map(item => {
             if (item.itemId === habitItem.itemId) {

              if(item.lastCheckedDate!==currentDate){

                item.streak = (item.streak || 0) + 1;
                item.lastCheckedDate=currentDate;
                streakCheckbox.disabled=true;
              }
      
      //Render streak
      showStreak.textContent = item.streak; 
 
             }
             return item;
           });
 
           //update registereduser with updated currentuser
               registeredUsers = registeredUsers.map((user) =>
                     user.id === currentUser.id ? currentUser : user
                   );
           //save updated registeruser and currentuser in localstorage
                 localStorage.setItem("currentUser", JSON.stringify(currentUser));
                 localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
       }
     } 
     //03-08*************************
     else{
      streakCounter = 0;
     }

     });
     

    

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

    // habitDetails.append(streakElement);

    deleteBtn.style.width = "50px";
    editBtn.style.width = "50px";
    habitContainer.prepend(habitCard);

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

       //
       modal.style.display = "block";
       addHabitBtn.style.display = "none";
       saveBtn.style.display = "block";
      //  modalSpan.style.display ="none";
 
       //
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const editHabitItem = currentUser.habitList.find(
        (item) => item.itemId === habitItem.itemId
      );
      if (!editHabitItem) return;

      //
      titleInput.value = editHabitItem.title;
      const editStreakInput = document.getElementById("editStreakInput"); // Ensure you have this line if you haven't already defined editStreakInput elsewhere
      editStreakInput.value = editHabitItem.streak;


     
      saveBtn.onclick = () => {
        saveHabitChanges(editHabitItem.itemId);

        modal.style.display = "none";
        addHabitBtn.style.display="block";
        saveBtn.style.display="none";

      
          priorityInput.value ="0";

       
        editStreakInput.value = "";
        titleInput.value="";


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


      //************* */
        addHabitBtn.style.display = "block";
        saveBtn.style.display = "none";
        modal.style.display = "none";
        addHabitBtn.style.display="block";
        priorityInput.value ="0";
        editStreakInput.value = "";
        titleInput.value="";

      //************************** */
    };
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";

       //************* */
       addHabitBtn.style.display = "block";
       saveBtn.style.display = "none";
       modal.style.display = "none";
       addHabitBtn.style.display="block";
       priorityInput.value ="0";
       editStreakInput.value = "";
       titleInput.value="";

     //************************** */
    }
  };

  addHabitBtn?.addEventListener("click", () => {
    let title = titleInput.value;
    let priority = priorityInput ? priorityInput.value : "None"; // Default category if none selected

    let streak = 0;

    if (!title) return;

    let habitItem = {
      itemId: Date.now().toString(), // Unique ID for each habit item
      title,
      priority,
      streak,
      lastCheckedDate:""
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
  //how to reset filtering and sorting

  let priorityFilter = document.getElementById("priorityFilterDropdown");
  priorityFilter?.addEventListener("change", () => {
    let selectedPriority = priorityFilter.value;
    /*************REFRESH PRIORITY filter******03-06  */
    if (selectedPriority === "Resetfiltering") {
      //render all of habits as normal
      if (
        currentUser &&
        currentUser.habitList &&
        currentUser.habitList.length > 0
      ) {
        habitContainer.innerHTML = "";
        currentUser.habitList.forEach((habitItem) => {
          renderHabitCard(habitItem);
        });
      }
    } else {
      let filteredHabits = currentUser.habitList.filter((habitItem) => {
        return habitItem.priority === selectedPriority;
      });

      const habitContainer = document.getElementById("habitContainer");
      habitContainer.innerHTML = "";

      filteredHabits.forEach((habitItem) => {
        renderHabitCard(habitItem);
      });
    }
  });
  //----------------FILTRERING SLUT ------------------------------------//

  //sorting by priority

  //giving number to each of priorities by having them in array to use their index

  const priorityOrder = ["low", "medium", "high"];
  let prioritySortDropdown = document.getElementById("prioritySortDropdown");

  const sortedHabitsByPriority = (sortOrder) => {
    const sortedPriority = currentUser.habitList.slice().sort((a, b) => {
      let indexA = priorityOrder.indexOf(a.priority);
      let indexB = priorityOrder.indexOf(b.priority);

      console.log("indexa" + indexA);

      console.log("indexB" + indexB);

      return sortOrder === "lowToHigh" ? indexA - indexB : indexB - indexA;
    });

    renderSortedPriority(sortedPriority);
  };

  const renderSortedPriority = (sortedPriority) => {
    habitContainer.innerHTML = "";
    sortedPriority.forEach((habitItem) => renderHabitCard(habitItem));
  };

  prioritySortDropdown?.addEventListener("change", () => {
    const sortOrder = prioritySortDropdown.value;
    /*************REFRESH PRIORITY sort******03-06  */
    if (sortOrder === "resetSortingPriority") {
      //render all of habits as normal
      if (
        currentUser &&
        currentUser.habitList &&
        currentUser.habitList.length > 0
      ) {
        habitContainer.innerHTML = "";
        currentUser.habitList.forEach((habitItem) => {
          renderHabitCard(habitItem);
        });
      }
    } else {
      console.log(sortOrder);
      sortedHabitsByPriority(sortOrder);
    }
  });

  //streak

  const sortedHabitsByStreak = (order) => {
    const sortedStreak = currentUser.habitList.slice().sort((a, b) => {
      return order === "lowToHigh" ? a.streak - b.streak : b.streak - a.streak;
    });
    renderSortedStreak(sortedStreak);
  };

  const renderSortedStreak = (sortedStreak) => {
    habitContainer.innerHTML = "";
    sortedStreak.forEach((habitItem) => renderHabitCard(habitItem));
  };

  let streakSortedDropdown = document.getElementById("streakSortDropdown");

  streakSortedDropdown?.addEventListener("change", () => {
    const sortOrder = streakSortedDropdown.value;
    /*************REFRESH streak sort******03-06  */
    if (sortOrder === "resetSortingStreak") {
      //render all of habits as normal
      if (
        currentUser &&
        currentUser.habitList &&
        currentUser.habitList.length > 0
      ) {
        habitContainer.innerHTML = "";
        currentUser.habitList.forEach((habitItem) => {
          renderHabitCard(habitItem);
        });
      }
    } else {
      console.log(sortOrder);
      sortedHabitsByPriority(sortOrder);
    }

    sortedHabitsByStreak(sortOrder);
  });
};
