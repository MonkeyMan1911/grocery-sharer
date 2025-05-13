class loadLists {
    constructor(config) {
        this.list = config.list
    }

    createList(list) {
        this.element = document.createElement(`div`)
        this.element.classList.add(`list`)
        this.element.classList.add(`id-${list.id}`)

        this.element.innerHTML = (`
            <div class="list-header">
                <h2 class="list-title">${list.title}</h2>
                <h2 class="list-date">${list.date}</h2>
            </div>
            <hr class="list-hr">
            <div class="list-items items-${list.title.replace(/ +/g, "")}"></div>
            <hr class="list-hr">
            <div class="list-footer footer-${list.title.replace(/ +/g, "")}">
                <button class="edit-list" onclick="window.location.href='/edit_list'; sessionStorage.setItem('editId', '${list.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#02d480"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>
                <button class="delete-list" onclick="deleteList('${list.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff0000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
        `)
    }

    addItems(list) {
        let itemsList = this.element.querySelector(`.items-${list.title.replace(/ +/g, "")}`)
        list.items.forEach(item => {
            let itemDiv = document.createElement("div")
            itemDiv.classList.add("item-div")

            itemDiv.innerHTML = (`
                <button class="item-checkButton ${item.item_name.replace(/ +/g, "")}" data-checked=${item.checked} onclick="clickCheckbox(this, '${item.item_name}', '${this.list.id}')"></button>
                <p class="item">${item.item_name}</p>
                <p class="item-quantity">x${item.quantity}</p>
            `)
            itemsList.appendChild(itemDiv)
        })
    }

    init(container) {
        this.createList(this.list)
        this.addItems(this.list)
        container.prepend(this.element)
    }
}

async function getLists() {
    const response = await $.ajax({
        url: "/load_lists",
        type: "POST",
        data: JSON.stringify({"username": sessionStorage.getItem("username")}),
        contentType: "application/json",
    })
    const data = response.result
    return data
}

async function loadListsFunc() {
    const container = document.querySelector(".lists")
    let lists = await getLists()

    const temp = document.createDocumentFragment();
    lists.forEach(list => {
        const newList = new loadLists({
            list: list
        })
        newList.init(temp)
    })

    container.replaceChildren(...temp.children)
}

function refreshLists() {
    loadListsFunc()
    setTimeout(refreshLists, 5000)
}
refreshLists()