from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# File path to store user data
USER_DATA_FILE = "users.txt"

# Utility function to load users from the file
def load_users():
    users = {}
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, 'r') as file:
            for line in file:
                username, password = line.strip().split(':')
                users[username] = password
    return users

# Utility function to save users to the file
def save_user(username, password):
    with open(USER_DATA_FILE, 'a') as file:
        file.write(f"{username}:{password}\n")

# Route to register users
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Load existing users
    users = load_users()

    # Check if the user already exists
    if username in users:
        return jsonify({"error": "User already exists"}), 400

    # Register the new user
    save_user(username, password)
    return jsonify({"message": "User registered successfully"}), 201

# Route to login users
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Load existing users
    users = load_users()

    # Check if credentials are correct
    if username not in users or users[username] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "access_token": "dummy-token"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
