class sendAlert {
    constructor (alert) {
        this.alert = alert
    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add("alert")

        this.element.innerHTML = (`
                <svg class="x-close" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#484848"><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/></svg>
                <p class="alert-text">${this.alert}</p>
                <div class="progress-bar">
                    <div class="empty-bar"></div>
                    <div class="colored-bar"></div>
                </div>
        `)

        this.element.querySelector(".x-close").addEventListener("click", () => this.done())
    }

    done() {
        this.element.remove()
    }

    checkCompletetion() {
        const bar = document.querySelector(".colored-bar")
        bar.addEventListener("animationend", () => this.done())
    }

    init(container) {
        this.createElement()
        container.prepend(this.element)
        this.checkCompletetion()
    }
}

if (localStorage.getItem("newListSaved") === "true") {
    localStorage.removeItem("newListSaved");
    const testAlert = new sendAlert("List Saved Successfully")
    testAlert.init(document.body)
}
