const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const authority = localStorage.getItem("authority");

if (!token || authority !== "ADMIN") {
  window.location.href = "login.html";
}

document.getElementById("loggedInUser").textContent = username;
document.getElementById("profileLink").href = `employee.html?username=${username}`;

if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
  document.getElementById("employeesLink").style.display = "block";
  document.getElementById("createTaskLink").style.display = "block";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("employeeId");
  localStorage.removeItem("authority");
  window.location.href = "login.html";
}

loadEmployees();

async function loadEmployees() {
  const response = await fetch(
    "http://localhost:8080/security-practice/employees",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  if (response.ok) {
    const employees = await response.json();
    const assignedToSelect = document.getElementById("assignedTo");
    const assignedBySelect = document.getElementById("assignedBy");

    employees.forEach((emp) => {
      const option1 = document.createElement("option");
      option1.value = emp.id;
      option1.textContent = `${emp.firstName} ${emp.lastName} (${emp.username})`;
      assignedToSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = emp.id;
      option2.textContent = `${emp.firstName} ${emp.lastName} (${emp.username})`;
      assignedBySelect.appendChild(option2);
    });
  }
}

async function createTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const status = document.getElementById("status").value;
  const dueDate = document.getElementById("dueDate").value;
  const assignedTo = document.getElementById("assignedTo").value;
  const assignedBy = document.getElementById("assignedBy").value;
  const message = document.getElementById("message");

  message.className = "message";
  message.textContent = "";

  if (!title || assignedTo === "" || assignedBy === "") {
    message.className = "message error";
    message.textContent = "Title, Assigned To and Assigned By are required";
    return;
  }

  const response = await fetch(
    "http://localhost:8080/security-practice/task",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        dueDate,
        assignedTo: parseInt(assignedTo),
        assignedBy: parseInt(assignedBy),
      }),
    }
  );

  if (response.ok) {
    message.className = "message success";
    message.textContent = "Task created successfully!";

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("status").value = "TODO";
    document.getElementById("dueDate").value = "";
    document.getElementById("assignedTo").selectedIndex = 0;
    document.getElementById("assignedBy").selectedIndex = 0;

  } else {
    message.className = "message error";
    message.textContent = "Failed to create task";
  }
}