function sendError(error) {
    const errorMessage = document.querySelector(".error-message")
    const errorWrapper = document.querySelector(".error-wrapper")

    errorMessage.innerHTML = error
    errorWrapper.classList.remove("hidden")
}

function removeError() {
    const errorMessage = document.querySelector(".error-message")
    const errorWrapper = document.querySelector(".error-wrapper")

    errorMessage.innerHTML = ""
    errorWrapper.classList.add("hidden")
}

async function saveEditedList() {
    id = sessionStorage.getItem("editId")

    if (document.querySelector(".list-name").value === "") {
        sendError("Please fill in all fields")
        return
    }

    const items = document.querySelector(".items")
    let hasEmptyField = false
    Array.from(items.children).forEach(child => {
        Array.from(child.children).forEach(value => {
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

    removeError()

    let updatedList = {}

    // Share with users
    const users = document.querySelector(".users")
    let usersList = users.value.split(", ")
    console.log(usersList)
    if (usersList.length === 1 && usersList[0] === "") {
        usersList = null
    }
    else {
        const response = await $.ajax({
            url: "/edit_list_requests",
            type: "POST",
            data: JSON.stringify({users: usersList, from_user: sessionStorage.getItem("username"), id: id}),
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

    updatedList.users = [sessionStorage.getItem("username")]
    updatedList.extra_users = usersList
    
    updatedList.id = id

    let itemsList = []
    Array.from(items.children).forEach(item => {
        let item_name
        let quantity
        Array.from(item.children).forEach(element => {
            if (element.hasChildNodes()) {
                Array.from(element.children).forEach(value => {
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
    updatedList.items = itemsList

    const title = document.querySelector(".list-name").value
    updatedList.title = title

    $.ajax({
        url: "/edit_list_values",
        type: "POST",
        data: JSON.stringify({updated_values: updatedList}),
        contentType: "application/json"
    })
    .done((response) => {
        localStorage.setItem("newListSaved", "true");
        window.location.href = "/dashboard"
    })
}