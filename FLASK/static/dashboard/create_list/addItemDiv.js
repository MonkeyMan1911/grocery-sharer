class addItemDiv {
    constructor(id) {
        this.id = id
    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add("add-item-form")
        this.element.id = this.id

        this.element.innerHTML = (`
            <hr>
            <div class="item-row">
                <input type="text" class="item-name" placeholder="Item Name">
                <input type="number" class="item-quantity" placeholder="Item Quantity">
                <button class="delete-item" id='delete-${this.id}'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ff0000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
            <hr>    
        `)
    }

    deleteElement() { 
        console.log(this.element.id)
        this.container.removeChild(document.getElementById(this.id))
    }

    init(container) {
        this.container = container
        this.createElement()
        container.appendChild(this.element)
        document.getElementById(`delete-${this.id}`).addEventListener("click", () => this.deleteElement())
    } 
}

