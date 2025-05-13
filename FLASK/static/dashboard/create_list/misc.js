document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("users");
    textarea.addEventListener("input", () => {
        textarea.style.height = "auto"; // reset height
        textarea.style.height = textarea.scrollHeight + "px"; // adjust to scroll height
    });
});

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