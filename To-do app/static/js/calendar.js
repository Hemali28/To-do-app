const calendarContainer = document.getElementById("calendar-container");
const todoContainer = document.getElementById("todo-container");
const todoDate = document.getElementById("todo-date");
const todoList = document.getElementById("todo-list");
const newTaskInput = document.getElementById("new-task");

const today = new Date();
const year = today.getFullYear();

function renderCalendar(year) {
  calendarContainer.innerHTML = "";
  for (let month = 0; month < 12; month++) {
    const monthDiv = document.createElement("div");
    monthDiv.classList.add("month");
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
    monthDiv.innerHTML = `<h4>${monthName}</h4>`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateBtn = document.createElement("div");
      dateBtn.classList.add("date");
      dateBtn.innerText = day;
      dateBtn.onclick = () => openTodo(`${year}-${month + 1}-${day}`);
      monthDiv.appendChild(dateBtn);
    }

    calendarContainer.appendChild(monthDiv);
  }
}

function openTodo(date) {
  todoDate.innerText = "Tasks for " + date;
  todoContainer.style.display = "block";
  fetch(`/get_tasks/${date}`)
    .then(res => res.json())
    .then(data => {
      todoList.innerHTML = "";
      data.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task;
        li.onclick = () => {
          data.splice(index, 1);
          saveTasks(date, data);
        };
        todoList.appendChild(li);
      });
    });

  document.getElementById("add-task").onclick = () => {
    const task = newTaskInput.value.trim();
    if (task) {
      fetch(`/get_tasks/${date}`)
        .then(res => res.json())
        .then(tasks => {
          tasks.push(task);
          saveTasks(date, tasks);
          newTaskInput.value = "";
        });
    }
  };
}

function saveTasks(date, tasks) {
  fetch(`/save_tasks/${date}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks)
  }).then(() => openTodo(date));
}

// Dark/Light Mode
document.getElementById("toggle-mode").onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
};

renderCalendar(year);
