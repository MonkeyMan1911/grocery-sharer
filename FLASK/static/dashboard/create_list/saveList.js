function sendError(error) {
    const errorMessage = document.querySelector(".error-message")
    const errorWrapper = document.querySelector(".error-wrapper")

    errorMessage.innerHTML = error
    errorWrapper.classList.remove("hidden")
}

async function saveList() {
    if (document.querySelector(".list-name").value === "") {
        sendError("Please fill in all fields")
        return
    }
    
    const items = document.querySelector(".items")
    let hasEmptyField = false
    Array.from(items.children).forEach(item => {
        Array.from(item.children).forEach(value => {
            if (value.tagName === "INPUT") {
                if (value.value === "") {
                    hasEmptyField = true
                }
            }
            if (value.hasChildNodes()) {
                Array.from(value.children).forEach(value => {
                    if (value.tagName === "INPUT") {
                        if (value.value === "") {
                            hasEmptyField = true
                        }
                    }
                })
            }
        })
    })

    if (hasEmptyField) {
        sendError("Please fill in all fields")
        return
    } 

    let listToSave = {}

    // Share with users
    const users = document.querySelector(".users")
    let usersList = users.value.split(", ")
    console.log(usersList)
    if (usersList.length === 1 && usersList[0] === "") {
        usersList = null
    }
    else {
        const response = await $.ajax({
            url: "/check_users",
            type: "POST",
            data: JSON.stringify({users: usersList, from_user: sessionStorage.getItem("username")}),
            contentType: "application/json"
        })
        const data = response.result
        if (data === "users_not_found") {
            const errorMessage = document.querySelector(".error-message")
            errorMessage.style.paddingLeft = "80px"
            sendError("Some users were not found")
            return
        }
    }

    listToSave.users = [sessionStorage.username]
    listToSave.owner = sessionStorage.username

    listToSave.extra_users = usersList

    const title = document.querySelector(".list-name").value
    listToSave.title = title

    const date = new Date()
    let month = date.getMonth()
    if (month < 10) {
        month = `0${month + 1}`
    }
    let day = date.getDate()
    if (day < 10) {
        day = `0${day}`
    }
    let year = date.toLocaleDateString('en', {year: "2-digit"})
    const listDate = `${month}.${day}.${year}`
    listToSave.date = listDate

    let itemsList = []
    Array.from(items.children).forEach(item => {
        let item_name
        let quantity
        Array.from(item.children).forEach(value => {
            if (value.tagName === "INPUT") {
                if (value.classList.contains("item-name")) {
                    item_name = value.value
                }
                if (value.classList.contains("item-quantity")) {
                    quantity = Number(value.value)
                    itemsList.push({item_name, quantity, checked: false})
                }
            }
            if (value.hasChildNodes()) {
                Array.from(value.children).forEach(value => {
                    if (value.tagName === "INPUT") {
                        if (value.classList.contains("item-name")) {
                            item_name = value.value
                        }
                        if (value.classList.contains("item-quantity")) {
                            quantity = Number(value.value)
                            itemsList.push({item_name, quantity, checked: false})
                        }
                    }
                })
            }
        })
    })
    listToSave.items = itemsList

    $.ajax({
        url: "/add_list",
        type: "POST",
        data: JSON.stringify({list: listToSave}),
        contentType: "application/json"
    })
    .done((response) => {
        localStorage.setItem("newListSaved", "true");
        window.location.href = "/dashboard"
        console.log(usersList)
    })
}