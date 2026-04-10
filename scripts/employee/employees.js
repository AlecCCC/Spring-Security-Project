document.getElementById("loggedInUser").textContent =
localStorage.getItem("username");

if (authority === "ADMIN") {
  document.getElementById("tasksLink").style.display = "block";
}

async function loadEmployees() {
try {
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
    const tbody = document.getElementById("employeeList");

    if (employees.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">No employees found</td></tr>`;
    } else {
        employees.forEach((emp) => {
        const badgeClass =
            emp.authority === "ADMIN" ? "badge-admin" : "badge-user";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.username}</td>
            <td>${emp.firstName}</td>
            <td>${emp.lastName}</td>
            <td>${emp.email}</td>
            <td><span class="badge ${badgeClass}">${emp.authority}</span></td>
            <td><a class="profile-link" href="employee.html?id=${emp.id}">View Profile</a></td>
        `;
        tbody.appendChild(tr);
        });
    }
    } else {
    alert("Access denied or error loading employees");
    }
} finally {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("content").style.display = "block";
}
}

loadEmployees();
