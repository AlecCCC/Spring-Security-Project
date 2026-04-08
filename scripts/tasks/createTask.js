const token = localStorage.getItem("token");
const authority = localStorage.getItem("authority");

if (!token || authority !== "ADMIN") {
window.location.href = "login.html";
}


    document.getElementById("loggedInUser").textContent =
    localStorage.getItem("username");

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

    if (!title || !assignedTo || !assignedBy) {
        message.className = "message error";
        message.textContent =
        "Title, Assigned To and Assigned By are required";
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
        },
    );

    if (response.ok) {
        message.className = "message success";
        message.textContent = "Task created successfully!";

        // clear the form
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("status").value = "TODO";
        document.getElementById("dueDate").value = "";
        document.getElementById("assignedTo").value = "";
        document.getElementById("assignedBy").value = "";
    } else {
        message.className = "message error";
        message.textContent = "Failed to create task";
    }
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
        },
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