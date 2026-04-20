const token = localStorage.getItem("token");
const authority = localStorage.getItem("authority");
const username = localStorage.getItem("username");

if (!token || authority !== "ADMIN") {
  window.location.href = "login.html";
}

document.getElementById("loggedInUser").textContent = username;
document.getElementById("profileLink").href = `employee.html?username=${username}`;

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

//pagination
let currentPage = 0;
const pageSize = 5;

async function loadTasks(page = 0) {
  currentPage = page;
  const taskList = document.getElementById("taskList");
  const spinner = document.getElementById("spinner");

  taskList.style.display = "none";
  spinner.style.display = "flex";

  try {
    const response = await fetch(
      `http://localhost:8080/security-practice/task?page=${page}&size=${pageSize}`,
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
      const tasks = data.content;        // ← tasks inside content
      const totalPages = data.totalPages;

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

      // render pagination buttons
      renderPagination(page, totalPages);

    } else {
      taskList.innerHTML = `<p class="no-tasks">Access denied or not logged in</p>`;
    }

  } finally {
    spinner.style.display = "none";
    taskList.style.display = "block";
  }
}

function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (currentPage > 0) {
    const prev = document.createElement("button");
    prev.textContent = "Previous";
    prev.onclick = () => loadTasks(currentPage - 1);
    pagination.appendChild(prev);
  }

  const info = document.createElement("span");
  info.textContent = ` Page ${currentPage + 1} of ${totalPages} `;
  pagination.appendChild(info);

  if (currentPage < totalPages - 1) {
    const next = document.createElement("button");
    next.textContent = "Next";
    next.onclick = () => loadTasks(currentPage + 1);
    pagination.appendChild(next);
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
    }
  );

  if (response.ok) {
    document.getElementById(`task-${id}`).remove();
    // reload current page in case it's now empty
    loadTasks(currentPage);
  } else {
    alert("Failed to delete task");
  }
}