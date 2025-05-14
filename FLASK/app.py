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

@app.route("/get_list_id", methods=["POST"])
def get_list_id():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    id = data["id"]

    with open(file_path, "r") as file:
        result = json.load(file)

    groceryList = {}
    for lst in result["lists"]:
        if lst["id"] == id:
            groceryList = lst
            break

    return jsonify(result=groceryList)

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

@app.route("/add_list", methods=["POST"])
def add_list():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    list_to_add = data["list"]

    with open(file_path, "r") as file:
        result = json.load(file)

    if len(result["lists"]) > 0:
        last_id = result["lists"][-1]["id"]
        last_id_int = int(last_id.split("-")[-1])

        next_id = last_id_int + 1
        new_id = f"id-{next_id}"
    else:
        new_id = "id-0"

    list_to_add["id"] = new_id
    result["lists"].append(list_to_add)

    with open(file_path, "w") as file:
        json.dump(result, file, indent=4)

    return jsonify({"success": True})

@app.route("/edit_list")
def edit_list_page():
    return render_template("edit_list.html")

@app.route("/edit_list_values", methods=["POST"])
def edit_list():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "dashboard", "lists.json")

    updated_values = data["updated_values"]

    with open(file_path, "r") as file:
        result = json.load(file)

    for lst in result["lists"]:
        if lst["id"] == updated_values["id"]:
            lst["title"] = updated_values["title"]
            lst["items"] = updated_values["items"]
            lst["users"] = updated_values["users"]
            lst["extra_users"] = updated_values["extra_users"]
            break

    with open(file_path, "w") as file:
        json.dump(result, file, indent=4)

    return jsonify({"success": True})

@app.route("/check_users", methods=["POST"])
def check_users():
    data = request.get_json()
    logins_file = os.path.join(app.static_folder, "login_page", "logins.json")
    requests_file = os.path.join(app.static_folder, "dashboard", "share_requests.json")
    lists_file = os.path.join(app.static_folder, "dashboard", "lists.json")

    users = data["users"]  
    from_user = data["from_user"] 

    with open(logins_file, "r") as file:
        logins = json.load(file)

    with open(requests_file, "r") as file:
        requests = json.load(file)

    with open(lists_file, "r") as file:
        result = json.load(file)

    last_id = result["lists"][-1]["id"]
    last_id_int = int(last_id.split("-")[-1])

    next_id = last_id_int + 1
    new_id = f"id-{next_id}"

    existing_users = []
    for login in logins["logins"]:
        if login["username"] in users:
            existing_users.append(login["username"]) 

    if set(existing_users) == set(users):
        next_id = 0
        for request_dict in requests["requests"]:
            last_id = request_dict["request_id"]
            last_id = last_id.removeprefix("r-id-")
            next_id = int(last_id) + 1

        new_request = {}
        new_request["request_id"] = f"r-id-{str(next_id)}"
        new_request["list_id"] = new_id
        new_request["from"] = from_user
        new_request["to"] = users

        requests["requests"].append(new_request)    

        with open(requests_file, "w") as file:
            json.dump(requests, file, indent=4)

        return jsonify({"result": "users_found"})
    else:
        return jsonify({"result": "users_not_found"})
    
@app.route("/edit_list_requests", methods=["POST"])
def edit_list_requests():
    data = request.get_json()
    logins_file = os.path.join(app.static_folder, "login_page", "logins.json")
    requests_file = os.path.join(app.static_folder, "dashboard", "share_requests.json")

    users = data["users"]  
    from_user = data["from_user"] 
    list_id = data["id"]

    with open(logins_file, "r") as file:
        logins = json.load(file)

    with open(requests_file, "r") as file:
        requests = json.load(file)

    existing_users = []
    for login in logins["logins"]:
        if login["username"] in users:
            existing_users.append(login["username"]) 

    if set(existing_users) == set(users):
        request_used = False
        updated_request = {}
        updated_request["list_id"] = list_id
        updated_request["from"] = from_user
        updated_request["to"] = users
        for request_dict in requests["requests"]:
            if request_dict["list_id"] == list_id:
                updated_request["request_id"] = request_dict["request_id"]
                requests["requests"].remove(request_dict)
                requests["requests"].append(updated_request)
                request_used = True
                break
        
        if request_used == False:
            next_id = 0
            for request_dict in requests["requests"]:
                last_id = request_dict["request_id"]
                last_id = last_id.removeprefix("r-id-")
                next_id = int(last_id) + 1

            updated_request["request_id"] = f"r-id-{str(next_id)}"
            requests["requests"].append(updated_request)

        with open(requests_file, "w") as file:
            json.dump(requests, file, indent=4)

        return jsonify({"result": "users_found"})
    else:
        return jsonify({"result": "users_not_found"})

@app.route("/check_notifications", methods=["POST"])
def check_notifications():
    data = request.get_json()
    requests_file = os.path.join(app.static_folder, "dashboard", "share_requests.json")

    username = data["username"]

    with open(requests_file, "r") as file:
        requests = json.load(file)

    user_requests = []
    for request_dict in requests["requests"]:
        if username in request_dict["to"]:
            user_requests.append(request_dict)

    return jsonify(result=user_requests)

@app.route("/accept_request", methods=["POST"])
def accept_request():
    data = request.get_json()
    requests_file = os.path.join(app.static_folder, "dashboard", "share_requests.json")
    lists_file = os.path.join(app.static_folder, "dashboard", "lists.json")

    list_id = data["list_id"]
    username = data["user"]    

    with open (requests_file, "r") as file:
        requests = json.load(file)

    with open (lists_file, "r") as file:
        lists = json.load(file)

    for request_dict in requests["requests"]:
        if request_dict["list_id"] == list_id:
            request_dict["to"].remove(username)
            if len(request_dict["to"]) == 0:
                requests["requests"].remove(request_dict)
            break

    for lst in lists["lists"]:
        if lst["id"] == list_id:
            lst["users"].append(username)
            break
    
    with open(requests_file, "w") as file:
        json.dump(requests, file, indent=4)

    with open(lists_file, "w") as file:
        json.dump(lists, file, indent=4)

    return jsonify({"success": True})

@app.route("/decline_request", methods=["POST"])
def decline_request():
    data = request.get_json()
    requests_file = os.path.join(app.static_folder, "dashboard", "share_requests.json")
    lists_file = os.path.join(app.static_folder, "dashboard", "lists.json")

    list_id = data["list_id"]
    username = data["user"]    

    with open (requests_file, "r") as file:
        requests = json.load(file)

    with open (lists_file, "r") as file:
        lists = json.load(file)

    for request_dict in requests["requests"]:
        if request_dict["list_id"] == list_id:
            request_dict["to"].remove(username)
            if len(request_dict["to"]) == 0:
                requests["requests"].remove(request_dict)
            break

    for lst in lists["lists"]:
        if lst["id"] == list_id:
            lst["extra_users"].remove(username)
            break
    
    with open(requests_file, "w") as file:
        json.dump(requests, file, indent=4)

    with open(lists_file, "w") as file:
        json.dump(lists, file, indent=4)
        
    return jsonify({"success": True})

@app.route("/sign_up")
def sign_up():
    return render_template('sign_up.html')

@app.route("/create_signup", methods=["POST"])
def create_signup():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "login_page", "logins.json")

    with open(file_path, "r") as file:
        result = json.load(file)

    new_user = {
        "username": data["username"],
        "password": data["password"]
    }

    result["logins"].append(new_user)

    with open(file_path, "w") as file:
        json.dump(result, file, indent=4)

    return jsonify({"result": True})

@app.route("/check_signup", methods=["POST"])
def check_signup():
    data = request.get_json()
    file_path = os.path.join(app.static_folder, "login_page", "logins.json")

    with open(file_path, "r") as file:
        result = json.load(file)

    already_exists = False
    for login in result["logins"]:
        if login["username"] == data["username"]:
            already_exists = True
            break

    return jsonify({"result": already_exists})

if __name__ == '__main__':
    app.run(debug=True)
