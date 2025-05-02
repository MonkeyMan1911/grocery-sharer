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

if __name__ == '__main__':
    app.run(debug=True)