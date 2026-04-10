
    async function register() {
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    // reset message
    message.className = "message";
    message.textContent = "";

    // basic frontend validation
    if (!username || !firstName || !lastName || !email || !password) {
        message.className = "message error";
        message.textContent = "All fields are required";
        return;
    }

    if (password !== confirmPassword) {
        message.className = "message error";
        message.textContent = "Passwords do not match";
        return;
    }

    const response = await fetch(
        "http://localhost:8080/security-practice/register",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password,
        }),
        },
    );

    if (response.ok) {
        message.className = "message success";
        message.textContent =
        "Account created successfully! Redirecting to login...";
        setTimeout(() => {
        window.location.href = "login.html";
        }, 2000);
    } else {
        message.className = "message error";
        message.textContent =
        "Registration failed. Username or email may already exist.";
    }
    }