class DeleteList {
    constructor(listId) {
        this.listId = listId
        this.confirmed = false
    }

    createConfirmation() {
        this.element = document.createElement(`div`)
        this.element.classList.add(`confirmation`)
        this.element.classList.add(`${this.listId}`)

        this.element.innerHTML = (`
            <div class="confirmation-header">
                <h2 class="confirmation-title">Delete List?</h2>
            </div>
            <hr class="confirmation-hr">
            <div class="confirmation-footer">
                <button class="confirm-delete">Yes</button>
                <button class="cancel-delete">No</button>
            </div>
        `)

        this.element.querySelector('.confirm-delete').addEventListener('click', () => this.confirmDelete());
        this.element.querySelector('.cancel-delete').addEventListener('click', () => this.cancelDelete());
    }

    confirmDelete() {
        this.confirmed = true
        
        $.ajax({
            url: "/delete_list",
            type: "POST",
            data: JSON.stringify({"list_id": this.listId, "user": sessionStorage.getItem("username")}),
            contentType: "application/json"
        })

        this.done()
        document.querySelector(`.id-${this.listId}`).remove()
    }

    cancelDelete() {
        this.confirmed = false
        this.done()
    }

    done() {
        this.element.remove()
        document.querySelector(".overlay").style.pointerEvents = "none"
    }

    init(container) {
        this.createConfirmation()
        container.appendChild(this.element)
    }
}

function deleteList(listId) {
    const container = document.querySelector(`.deleteConfirmDiv`)
    const deleteList = new DeleteList(listId)
    document.querySelector(".overlay").style.pointerEvents = "all"
    deleteList.init(container)
}