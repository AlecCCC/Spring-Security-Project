const urlParams = new URLSearchParams(window.location.search);
const employeeIdFromUrl = urlParams.get("id");

const loggedInUsername = localStorage.getItem("username");
const loggedInEmployeeId = localStorage.getItem("employeeId");
const authority = localStorage.getItem("authority");
const token = localStorage.getItem("token");

if (
  !loggedInUsername || (employeeIdFromUrl && Number(employeeIdFromUrl) !== Number(loggedInEmployeeId) && authority !== "ADMIN")
) {
  window.location.href = "login.html";
}

if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
  document.getElementById("employeesLink").style.display = "block";
  document.getElementById("createTaskLink").style.display = "block";
  
}

// set navbar links
document.getElementById("loggedInUser").textContent = loggedInUsername;
document.getElementById("profileLink").href = `employee.html?username=${loggedInUsername}`;

if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("employeeId");
  localStorage.removeItem("authority");
  window.location.href = "login.html";
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "todo": return "status-todo";
    case "in_progress": return "status-in_progress";
    case "done": return "status-done";
    default: return "status-todo";
  }
}

async function loadEmployee() {
  try {
    const id = employeeIdFromUrl || localStorage.getItem("employeeId");

    const response = await fetch(
      `http://localhost:8080/security-practice/employees/${id}`,
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

      const isOwnProfile = Number(id) === Number(localStorage.getItem("employeeId"));

      document.getElementById("profileTitle").textContent = isOwnProfile
        ? "My Profile"
        : `${data.username}'s Profile`;

      const badgeClass = data.authority === "ADMIN" ? "badge-admin" : "badge-user";

      document.getElementById("profileInfo").innerHTML = `
        <div class="profile-item">
          <label>Username</label>
          <p>${data.username}</p>
        </div>
        <div class="profile-item">
          <label>First Name</label>
          <p>${data.firstName}</p>
        </div>
        <div class="profile-item">
          <label>Last Name</label>
          <p>${data.lastName}</p>
        </div>
        <div class="profile-item">
          <label>Email</label>
          <p>${data.email}</p>
        </div>
        <div class="profile-item">
          <label>Role</label>
          <p><span class="badge ${badgeClass}">${data.authority}</span></p>
        </div>
      `;

      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";

      if (data.assignedTasks.length === 0) {
        taskList.innerHTML = `<p class="no-tasks">No tasks assigned</p>`;
      } else {
        data.assignedTasks.forEach((task) => {
          const statusClass = getStatusClass(task.status);
          const div = document.createElement("div");
          div.className = "task-item";
          div.innerHTML = `
            <a href="task.html?id=${task.id}" style="text-decoration: none; color: inherit;">
              <div class="task-title">
                ${task.title}
                <span class="task-status ${statusClass}">${task.status}</span>
              </div>
              <div class="task-meta">
                Due: ${task.dueDate} · Assigned by: ${task.assignedByUsername}
              </div>
            </a>
          `;
          taskList.appendChild(div);
        });
      }

    } else if (response.status === 403) {
      alert("Access denied");
    } else {
      alert("Error loading profile");
    }

  } finally {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("content").style.display = "block";
  }
}

loadEmployee();