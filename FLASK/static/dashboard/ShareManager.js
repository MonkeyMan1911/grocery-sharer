class ShareManager {
    constructor(lists) {
        this.lists = lists 
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('share-manager');
        this.element.innerHTML = (`
            <svg class="x-icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#484848"><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/></svg>
            <h2 class="share-title">Share Manager</h2>
            <div class="share-requests"></div>
        `)
        this.element.querySelector(".x-icon").addEventListener("click", () => this.close());
        document.querySelector(".notification-icon").addEventListener("click", () => {
            this.close()
        });

        if (this.lists.length === 0) {
            this.element.querySelector(".share-requests").innerHTML = `<p>You have no new share requests.</p>`
        }
    }

    addRequests() {
        this.lists.forEach(list => {
            let listDiv = document.createElement("div")
            listDiv.classList.add("request-div")
            listDiv.id = list.list_id
            listDiv.innerHTML = (`
                <hr class="divider">
                <p>${(String(list.from).charAt(0).toUpperCase() + String(list.from).slice(1)).bold()} would like to share a list with you.</p>
                <div class="actions">
                    <button class="accept-button">Accept</button>
                    <button class="decline-button">Decline</button>
                </div>
                <hr class="divider">
            `)

            listDiv.querySelector(".accept-button").addEventListener("click", () => this.acceptRequest(list.list_id, list.from));
            listDiv.querySelector(".decline-button").addEventListener("click", () => this.declineRequest(list.list_id, list.from));

            this.element.appendChild(listDiv)
        })
    }

    acceptRequest(listId, fromUser) {
        $.ajax({
            url: "/accept_request",
            type: "POST",
            data: JSON.stringify({list_id: listId, user: sessionStorage.getItem("username")}),
            contentType: "application/json",
        })
        this.changeText(listId, `You have accepted a list from ${fromUser.bold()}.`)
    }

    declineRequest(listId, fromUser) {
        $.ajax({
            url: "/decline_request",
            type: "POST",
            data: JSON.stringify({list_id: listId, user: sessionStorage.getItem("username")}),
            contentType: "application/json",
        })
        this.changeText(listId, `You declined a list from ${fromUser.bold()}.`)
    }

    changeText(listId, text) {
        const listDiv = document.getElementById(listId)
        listDiv.innerHTML = (`
            <hr class="divider">
            <p>${text}</p>
            <hr class="divider">
        `)
    }

    close() {
        this.element.remove()
        let notifButton = document.querySelector(".notification-icon")
        notifButton.innerHTML = '<img src="/static/dashboard/images/read.svg" alt="Icon">'
    }

    init(container) {
        this.createElement()
        container.appendChild(this.element)
        this.addRequests()
    }
}

document.querySelector(".notification-icon").addEventListener("click", async () => {
    const container = document.querySelector(".shareManagerDiv")

    if (document.querySelector(".share-manager")) return;

    const response = await checkNotificationStatus()
    const shareManager = new ShareManager(response)
    shareManager.init(container)
})