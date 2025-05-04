function clickCheckbox(button, itemName="TestItem", listId) {
    button.dataset.checked = button.dataset.checked === "true" ? "false" : "true";

    $.ajax({
        url: "/check_item",
        type: "POST",
        data: JSON.stringify({"list_id": listId, "item_name": itemName}),
        contentType: "application/json",
    })
}