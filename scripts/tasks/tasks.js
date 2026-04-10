const token = localStorage.getItem("token");
const authority = localStorage.getItem("authority");
const username = localStorage.getItem("username");

document.getElementById("loggedInUser").textContent = username;
document.getElementById("profileLink").href = `employee.html?username=${username}`;


if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
  document.getElementById("employeesLink").style.display = "block";
  document.getElementById("createTaskLink").style.display = "block";
  
}

function getStatusClass(status) {
switch (status.toLowerCase()) {
    case "todo":
    return "status-todo";
    case "in_progress":
    return "status-in_progress";
    case "done":
    return "status-done";
    default:
    return "status-todo";
}
}

async function loadTasks() {
const taskList = document.getElementById("taskList");
const spinner = document.getElementById("spinner");

// show spinner
taskList.style.display = "none";
spinner.style.display = "flex";

try {
    const response = await fetch(
    "http://localhost:8080/security-practice/task",
    {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        },
    },
    );

    if (response.ok) {
    const tasks = await response.json();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `<p class="no-tasks">No tasks found</p>`;
    } else {
        tasks.forEach((task) => {
        const statusClass = getStatusClass(task.status);
        const div = document.createElement("div");
        div.className = "task-item";
        div.id = `task-${task.id}`;
        div.innerHTML = `
        <a href="task.html?id=${task.id}" style="text-decoration: none; color: inherit;">
            <div class="task-title">
            ${task.title}
            <span class="task-status ${statusClass}">${task.status}</span>
            </div>
            <div class="task-meta">
            Assigned to: ${task.assignedToUsername} · 
            Assigned by: ${task.assignedByUsername} · 
            Due: ${task.dueDate}
            </div>
        </a>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;
        taskList.appendChild(div);
        });
    }
    } else {
    taskList.innerHTML = `<p class="no-tasks">Access denied or not logged in</p>`;
    }
} finally {
    spinner.style.display = "none";
    taskList.style.display = "block";
}
}

async function deleteTask(id) {
if (!confirm(`Are you sure you want to delete task #${id}?`)) {
    return;
}

const response = await fetch(
    `http://localhost:8080/security-practice/task/${id}`,
    {
    method: "DELETE",
    headers: {
        Authorization: "Bearer " + token,
    },
    },
);

if (response.ok) {
    // remove the task from the page without reloading
    document.getElementById(`task-${id}`).remove();
} else {
    alert("Failed to delete task");
}
}