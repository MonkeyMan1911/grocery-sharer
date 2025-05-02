class loadLists {
    constructor(config) {
        this.list = config.list
    }

    createList(list) {
        this.element = document.createElement(`div`)
        this.element.classList.add(`list`)
        this.element.classList.add(`${list.title.replace(/ +/g, "")}`)

        this.element.innerHTML = (`
            <div class="list-header">
                <h2 class="list-title">${list.title}</h2>
                <h2 class="list-date">${list.date}</h2>
            </div>
            <hr class="list-hr">
            <div class="list-items items-${list.title.replace(/ +/g, "")}"></div>
        `)
    }

    addItems(list) {
        let itemsList = this.element.querySelector(`.items-${list.title.replace(/ +/g, "")}`)
        list.items.forEach(item => {
            let itemDiv = document.createElement("div")
            itemDiv.classList.add("item-div")

            itemDiv.innerHTML = (`
                <button class="item-checkButton" data-checked=${item.checked} onclick="clickCheckbox(this)"></button>
                <p class="item">${item.item_name}</p>
                <p class="item-quantity">x${item.quantity}</p>
            `)
            itemsList.appendChild(itemDiv)
        })
    }

    init(container) {
        this.createList(this.list)
        this.addItems(this.list)
        container.appendChild(this.element)
    }
}

function getLists() {
    $.ajax({
        url: "/load_lists",
        type: "POST",
        data: JSON.stringify({"username": "admin"}),
        contentType: "application/json",
    })
    .done((response) => {
        console.log("Data received:", response.result);
    })
    .fail((error) => {
        console.log(error)
    }) 
}

function loadListsFunc() {
    getLists()
    const newList = new loadLists({
        list:  [{'users': ['admin', 'user'], 'title': 'My List', 'date': '04.30.25', 'items': [{'item_name': 'Item 1', 'quantity': 2, 'checked': false},]}][0]
    })
    newList.init(document.querySelector(".lists"))
}
document.addEventListener('DOMContentLoaded', loadListsFunc())