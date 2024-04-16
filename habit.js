document.addEventListener('DOMContentLoaded', function() {
  const pomodoroModal = document.getElementById("pomodoroModal");

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

  //WEATHER STARTS
  if (window.location.pathname === "/habit.html") {
    let getWeather = async (latitude, longitude) => {
      let response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      let temperature = response.data.current_weather.temperature;
      let weatherCode = response.data.current_weather.weathercode;

      return {
        temperature,
        weatherCode,
      };
    };

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

    const ICON_MAP = new Map();

    addMapping([0, 1], "sun");
    addMapping([2], "cloud-sun");
    addMapping([3], "cloud");
    addMapping([45, 48], "smog");
    addMapping(
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
      "cloud-showers-heavy"
    );
    addMapping([71, 73, 75, 77, 85, 86], "snowflake");
    addMapping([95, 96, 99], "cloud-bolt");

    function addMapping(values, icon) {
      values.forEach((value) => {
        ICON_MAP.set(value, icon);
      });
    }

    function positionSuccess({ coords }) {
      getWeather(coords.latitude, coords.longitude)
        .then((weatherData) => {
          let weatherTemp = document.getElementById("weatherTemp");
          if (weatherTemp) {
            weatherTemp.innerHTML = `${weatherData.temperature}°C`;

            const currentIcon = document.querySelector(".weather-icon");
            function getIconUrl(weatherCode) {
              const iconName = ICON_MAP.get(weatherCode);
              return `icons/${iconName}.svg`;
            }
            currentIcon.src = getIconUrl(weatherData.weatherCode);
          } else {
            console.error("Element with id 'weatherTemp' not found");
          }
        })
        .catch((err) => {
          console.error("Error fetching weather:", err);
        });
    }

    function positionError() {
      alert(
        "Please allow us to use your location and refresh the page, or you can't get weather info for your position."
      );
    }
  }

  // WEATHER ENDS

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
      editedHabitItem.streak = editStreakInput.value;
      editedHabitItem.priority = priorityInput.value;

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
    const { title, priority, streak, lastCheckedDate } = habitItem;

    // const habitMainCard = document.createElement("div");
    // habitMainCard.classList.add("habit-main-card");

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
      habitPriorityCover.innerText = "PRIORITY: NONE";
      habitPriorityCover.classList.add("habit-priority-none-cover");
    }

    const habitInfo = document.createElement("div");
    habitInfo.classList.add("habit-info");

    const habitTitleInfo = document.createElement("div");
    habitTitleInfo.classList.add("habit-title-info");

    const titleElement = document.createElement("h4");
    titleElement.textContent = title;
    titleElement.classList.add("title-element");

    const priorityElement = document.createElement("div");
    priorityElement.classList.add("priority-element");
    priorityElement.textContent = priority;

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

    const titleStreakDiv = document.createElement("div");
    habitTitleInfo.append(titleStreakDiv);
    titleStreakDiv.classList.add("title-streak-div");

    habitInfo.append(habitPriorityCover);
    titleStreakDiv.append(titleElement);
    //-------------STREAK STARTS---------------

    const streakCheckbox = document.createElement("input");
    streakCheckbox.setAttribute("type", "checkbox");
    streakCheckbox.classList.add("streak-checkbox");
    const showStreak = document.createElement("p");
    showStreak.textContent = streak;
    showStreak.classList.add("streak-show");

    habitCard.append(streakCheckbox);
    titleStreakDiv.append(showStreak);

    //when page loads, check if todaysdate equal to habititem.lastcheckeddate, if user has already checked in today, disabled checkbox, and leave checkbox , checked.
    let initialDate = new Date().toISOString().split("T")[0];
    if (habitItem.lastCheckedDate === initialDate) {
      streakCheckbox.checked = true;
      streakCheckbox.disabled = true;
    }

    streakCheckbox?.addEventListener("click", () => {
      if (streakCheckbox.checked) {
        //03-08**********************

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        let registeredUsers =
          JSON.parse(localStorage.getItem("registeredUsers")) || [];

        //find the currentuser.habitlist.habititem that user has clicked on its checkbox and then update the currentuser with new streak
        if (currentUser && currentUser.habitList) {
          let currentDate = new Date().toISOString().split("T")[0];

          currentUser.habitList = currentUser.habitList.map((item) => {
            if (item.itemId === habitItem.itemId) {
              if (item.lastCheckedDate !== currentDate) {
                item.streak = (item.streak || 0) + 1;
                item.lastCheckedDate = currentDate;
                streakCheckbox.disabled = true;
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
          localStorage.setItem(
            "registeredUsers",
            JSON.stringify(registeredUsers)
          );
        }
      }
      //03-08*************************
      else {
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

    // habitMainCard.append(habitCard)
    habitCard.append(habitInfo);

    habitInfo.append(habitTitleInfo);
    habitInfo.append(habitDetails);
    habitInfo.append(habitDetails);

    habitTitleInfo.append(habitBtn);

    habitBtn.appendChild(editBtn);
    habitBtn.appendChild(deleteBtn);

    // habitDetails.append(streakElement);

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
      const editStreakInput = document.getElementById("editStreakInput");
      editStreakInput.value = editHabitItem.streak;

      saveBtn.onclick = () => {
        saveHabitChanges(editHabitItem.itemId);

        modal.style.display = "none";
        addHabitBtn.style.display = "block";
        saveBtn.style.display = "none";

        priorityInput.value = "0";

        editStreakInput.value = "";
        titleInput.value = "";
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
      addHabitBtn.style.display = "block";
      priorityInput.value = "0";
      editStreakInput.value = "";
      titleInput.value = "";

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
      addHabitBtn.style.display = "block";
      priorityInput.value = "0";
      editStreakInput.value = "";
      titleInput.value = "";

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
      lastCheckedDate: "",
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
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let selectedPriority = priorityFilter.value;

    if (selectedPriority === "Resetfiltering") {
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
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sortedPriority = currentUser.habitList.slice().sort((a, b) => {
      let indexA = priorityOrder.indexOf(a.priority);
      let indexB = priorityOrder.indexOf(b.priority);

      return sortOrder === "lowToHigh" ? indexA - indexB : indexB - indexA;
    });

    renderSortedPriority(sortedPriority);
  };

  const renderSortedPriority = (sortedPriority) => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    habitContainer.innerHTML = "";
    sortedPriority.forEach((habitItem) => renderHabitCard(habitItem));
  };

  prioritySortDropdown?.addEventListener("change", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sortOrder = prioritySortDropdown.value;

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
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sortedStreak = currentUser.habitList.slice().sort((a, b) => {
      return order === "lowToHigh" ? b.streak - a.streak : a.streak - b.streak;
    });
    renderSortedStreak(sortedStreak);
  };

  const renderSortedStreak = (sortedStreak) => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    habitContainer.innerHTML = "";
    sortedStreak.forEach((habitItem) => renderHabitCard(habitItem));
  };

  let streakSortedDropdown = document.getElementById("streakSortDropdown");

  streakSortedDropdown?.addEventListener("change", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const sortOrder = streakSortedDropdown.value;

    if (sortOrder === "resetSortingStreak") {
      let currentUser = JSON.parse(localStorage.getItem("currentUser"));

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
      sortedHabitsByStreak(sortOrder);
    }
  });

  // POMODORA Modal begins here ----------------------------------------

    pomodoroModal.style.display = "none";
  

  const openPomodoroModalBtn = document.getElementById("openPomodoroBtn");

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
  const workButton = document.querySelector(".timer-work");
  const shortBreakButton = document.querySelector(".timer-shortBreak");
  const longBreakButton = document.querySelector(".timer-longBreak");

  let countdown; // countdown timer
  let timeLeft;

  // Set Timer Function
  function setTimer(minutes) {
    if (pomodoroModal) {
      pomodoroModal.style.background = "#9ba9db";
    }
    clearInterval(countdown);
    let timeLeft = minutes * 60;
    updateTimerDisplay(timeLeft);
    startCountdown(timeLeft);
  }

  // Update Timer Display
  function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  function startCountdown(duration) {
    let timeLeft = duration;
    countdown = setInterval(() => {
      timeLeft -= 1;
      updateTimerDisplay(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdown);
        alert("Time is up!");
      }
    }, 1000);
  }

  workButton?.addEventListener("click", () => setTimer(25));
  shortBreakButton?.addEventListener("click", () => setTimer(5));
  longBreakButton?.addEventListener("click", () => setTimer(15));

  //start timer
  startButton?.addEventListener("click", () => {
    let timerInput = document.getElementById("timerTime");
    startButton.style.display="none";

    if (pomodoroModal) {
      pomodoroModal.style.background = "#9ba9db";
    }

    if (!timerInput) {
      // Create the timer input if it doesn't exist
      timerInput = document.createElement("input");
      timerInput.type = "text";
      timerInput.id = "timerTime";
      timerInput.value = "25"; // Default value
      // Append it to a specific location in your document, for example, inside a div with a known ID
      const container = document.getElementById("timerContainer"); // Make sure this exists in your HTML
      if (container) {
        container.appendChild(timerInput);
      } else {
        console.error("Container for timer input not found.");
        return;
      }
    }

    let timerValue = timerInput.value;

    clearInterval(countdown);

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

  stopButton?.addEventListener("click", () => {
    pomodoroModal.style.background = "rgba(0, 0, 0, 0.1)";
    clearInterval(countdown);
    timeLeft = 0;
    // //updated display time
    // const minutes = Math.floor(timeLeft/60);
    // const remainingSeconds = timeLeft % 60;
    timerDisplay.textContent = "25:00";
    timerInput.value = "";
    timerInput.disabled = false;
    /******* */
    const oldInput = document.getElementById("timerTime");
    if (oldInput) {
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.id = oldInput.id; // Keep the same ID for consistency
      newInput.value = "25"; // Reset value or set to default
      oldInput.parentNode.replaceChild(newInput, oldInput);
    } else {
      console.error("Timer input element not found. Cannot replace.");
    }
  });

  let isPaused = false;
  pauseButton?.addEventListener("click", () => {
    pomodoroModal.style.background = "rgba(0, 0, 0, 0.1)";
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
});
