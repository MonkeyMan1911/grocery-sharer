function giveError(message) {
    const errorWrapper = document.querySelector(".error-wrapper");
    const errorMessage = document.querySelector(".error-message");

    errorMessage.innerHTML = message;
    errorWrapper.classList.remove("hidden");
}