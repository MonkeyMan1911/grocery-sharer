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

function checkSignup() {
    const username = document.querySelector(".username").value;
    const password = document.querySelector(".password").value;

    if (username === "" || password === "") {
        giveError("Please fill in all fields.");
        return
    }

    signUp(username, password)
}

async function signUp(username, password) {
    const checkUser = await $.ajax({
        url: "/check_signup",
        type: "POST",
        data: JSON.stringify({"username": username}),
        contentType: "application/json",
    })
    if (checkUser.result === true) {
        giveError("Username already exists.");
        return
    }

    else {
    $.ajax({
        url: "/create_signup",
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
}