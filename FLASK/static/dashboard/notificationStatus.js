async function checkNotificationStatus() {
    const response = await $.ajax({
        url: "/check_notifications",
        type: "POST",
        data: JSON.stringify({"username": sessionStorage.getItem("username")}),
        contentType: "application/json",
    })
    const data = response.result
    return data
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await checkNotificationStatus()
    console.log(response)
    if (response.length > 0) {
        let notifButton = document.querySelector(".notification-icon")
        notifButton.innerHTML = '<img src="/static/dashboard/images/unread.svg" alt="Icon">'
    }
})