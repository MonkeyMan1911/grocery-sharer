from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route("/")
def hello():
    return render_template('login.html')

@app.route("/login", methods=["POST"])
def read(): 
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "login_page", "logins.json")

    # Open and read the JSON file 
    with open(file_path, "r") as file:
        result = json.load(file)

    success = False
    for login in result["logins"]:
        if login["username"] == data["username"] and login["password"] == data["password"]:
            print("Login successful")
            success = True
            
    return jsonify(result=success) 

@app.route("/load_lists", methods=["POST"])
def load_lists():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    username = data["username"]

    with open(file_path, "r") as file:
        result = json.load(file)

    user_lists = []
    for list in result["lists"]:
        if username in list["users"]:
            user_lists.append(list)

    return jsonify(result=user_lists)

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

@app.route("/new-list")
def new_list():
    return render_template('createList.html')

@app.route("/delete_list", methods=["POST"])
def delete_list():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    user_to_delete = data["user"]
    list_to_delete = data["list_id"]

    with open(file_path, "r") as file:
        result = json.load(file)

    updated_lists = []
    for lst in result["lists"]:
        if lst["id"] == list_to_delete:
            if user_to_delete in lst["users"]:
                lst["users"].remove(user_to_delete)
            # only keep the list if there are still users left
            if lst["users"]:
                updated_lists.append(lst)
        else:
            updated_lists.append(lst)

    result["lists"] = updated_lists

    with open(file_path, "w") as file:
        json.dump(result, file, indent=4)

    return jsonify({"success": True})

@app.route("/check_item", methods=["POST"])
def check_item():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    list_id = data["list_id"]
    item_name = data["item_name"]

    with open(file_path, "r") as file:
        result = json.load(file)

    for lst in result["lists"]:
        if lst["id"] == list_id:
            for item in lst["items"]:
                if item["item_name"] == item_name:
                    item["checked"] = not item["checked"]
                    break

    with open(file_path, "w") as file:
        json.dump(result, file, indent=4)

    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)