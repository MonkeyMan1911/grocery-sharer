class editList {
    constructor(groceryList) {
        this.groceryList = groceryList
    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add("create-list-form")

        this.element.innerHTML = (`
            <h1 class="title">Edit List</h1>
            <hr>
            <input type="text" class="list-name" placeholder="List Name" value="${this.groceryList.title}">
            <div class="items">
                
            </div>
            <button class="add-item">Add Item</button>
            <label for="users">Users</label>
            <textarea class="users" placeholder="user1, user2, etc" id="users">${this.groceryList.extra_users ?? ""}</textarea>
            <div class="actions">
                <button class="save" onclick="saveEditedList()">Save</button>
                <button class="cancel" onclick="window.location.href='/dashboard';sessionStorage.removeItem('editId')">Cancel</button>
            </div>
            <div class="error-wrapper hidden">
                <span class="error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff0000"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                </span>
                <p class="error-message"></p>  
            </div>    
        `)
    }

    deleteElement(id) { 
        Array.from(this.element.querySelector(".items").children).forEach(child => {
            if (child.id === id) {
                console.log(child.querySelector(".item-row").querySelector(".delete-item"))
            }
        })
        //this.element.querySelector(".items").removeChild(document.getElementById(id))
    }

    addItem(values) {
        const container = this.element.querySelector(".items")
        let prevId = -1
        Array.from(container.children).forEach(element => {
            prevId = Number(element.id)
        });
        let nextId = prevId + 1

        this.nextItem = document.createElement("div")
        this.nextItem.classList.add("add-item-form")
        this.nextItem.id = nextId
        this.nextItem.innerHTML = (`
            <hr>
                <div class="item-row">
                    <input type="text" class="item-name" placeholder="Item Name" value="${values.item_name}">
                    <input type="number" class="item-quantity" placeholder="Item Quantity" value=${values.quantity}>
                    <button class="delete-item" id="delete-${nextId}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff0000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>
            <hr>
        `)

        container.appendChild(this.nextItem)
        Array.from(container.children).forEach(child => {
            if (child.id === String(nextId)) {
                child.querySelector(".delete-item").addEventListener("click", () => {
                    child.remove()
                })
            }
        })
            
    }
 
    init(container) {
        this.createElement()
        for (let i=0; i < this.groceryList.items.length; i++) {
            this.addItem(this.groceryList.items[i])
        }
        container.prepend(this.element)
        this.deleteElement("2")
    }
}

async function getList() {
    let listId = sessionStorage.getItem("editId")
    const response = await $.ajax({
        url: "/get_list_id",
        type: "POST",
        data: JSON.stringify({id: listId}),
        contentType: "application/json",
    })
    const data = response.result
    return data
}

async function loadEdit() {
    let groceryList = await getList()

    const testEdit = new editList(groceryList)
    testEdit.init(document.body)

    document.querySelector(".add-item").addEventListener("click", () => {
        const container = document.querySelector(".items")
        let prevId = -1
        Array.from(container.children).forEach(element => {
            const idNum = Number(element.id)
            if (!isNaN(idNum)) {
                prevId = Math.max(prevId, idNum)
            }
        })
        const addItemClass = new addItemDiv(prevId + 1)
        addItemClass.init(container)
    })
}

loadEdit()