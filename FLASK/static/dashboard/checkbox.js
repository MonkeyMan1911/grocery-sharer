function clickCheckbox(button) {
    console.log(button.dataset.checked)
    button.dataset.checked = button.dataset.checked === "true" ? "false" : "true";
}