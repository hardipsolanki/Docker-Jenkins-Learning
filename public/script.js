const API_URL = "http://localhost:3001/api/v1/users";

const tableBody = document.getElementById("usersTableBody");
const createUserBtn = document.querySelector("#createUserBtn");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
async function loadUsers() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();

        tableBody.innerHTML = "";

        result.data.forEach((user) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user._id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
}

let isLoding = false;

// Create User
createUserBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLoding = true;
    fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value
        })
    }).then(async (response) => {
        if (!response.ok) {
            const errorData = await response.json()
            throw {
                status: response.status,
                message: errorData.message
            };
        }
        isLoding = false;
        username.value = "";
        email.value = "";
        password.value = "";
        loadUsers();
        return await response.json();
    }).catch((error) => {
        isLoding = false;
        if (error.status === 409) {
            alert("User already exists");
        }
        if (error.status === 400) {
            console.log("inside this erro: ", error)
            alert("Please fill all the fields");
        }

        console.error("Failed to create user:", error);
    });
});

if (isLoding) {
    createUserBtn.innerHTML = "Loading...";
    createUserBtn.disabled = true;
    createUserBtn.style.cursor = "not-allowed";
}

document.addEventListener("DOMContentLoaded", loadUsers);