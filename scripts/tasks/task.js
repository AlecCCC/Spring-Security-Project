const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const authority = localStorage.getItem("authority")

if (!token) {
  window.location.href = "login.html";
}

if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
  document.getElementById("employeesLink").style.display = "block";
  document.getElementById("createTaskLink").style.display = "block";
  
}

document.getElementById("loggedInUser").textContent = username;

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "todo": return "status-todo";
    case "in_progress": return "status-in_progress";
    case "done": return "status-done";
    default: return "status-todo";
  }
}


async function loadTask() {
  // Step 1 - get task id from URL
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");


  if (!taskId) {
    alert("No task ID provided");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/security-practice/task/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Step 3 - populate the fields
      document.getElementById("taskTitle").textContent = data.title;
      document.getElementById("taskDueDate").textContent = data.dueDate ?? "No due date";
      document.getElementById("taskAssignedTo").textContent = data.assignedToUsername;
      document.getElementById("taskAssignedBy").textContent = data.assignedByUsername;
      document.getElementById("taskDescription").textContent = data.description ?? "No description";

      // Step 4 - status badge with color
      const statusClass = getStatusClass(data.status);
      document.getElementById("taskStatus").innerHTML =
        `<span class="task-status ${statusClass}">${data.status}</span>`;

    } else if (response.status === 403) {
      alert("Access denied");
    } else {
      alert("Task not found");
    }

  } finally {
    // Step 5 - hide spinner show content
    document.getElementById("spinner").style.display = "none";
    document.getElementById("content").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("employeeId");
  localStorage.removeItem("authority");
  window.location.href = "login.html";
}

loadTask();