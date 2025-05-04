function checkLogin() {
    const username = document.querySelector(".username").value;
    const password = document.querySelector(".password").value;

    if (username === "" || password === "") {
        giveError("Please fill in all fields.");
        return
    }

    login(username, password)
}

function login(username, password) {
    $.ajax({
        url: "/login",
        type: "POST",
        data: JSON.stringify({"username": username, "password": password, file: "static/login_page/logins.json"}),
        contentType: "application/json",
    })
    .done((response) => {
        console.log("Data received:", response.result);
        if (response.result === true) {
            sessionStorage.setItem("username", username);
            window.location.href = "/dashboard";
        }
        if (response.result === false) {
            giveError("Invalid username or password.");
        }
    })
    .fail((error) => {
        console.log(error)
    }) 
}