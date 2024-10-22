from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# File path to store user data
USER_DATA_FILE = "my-app/src/users.txt"

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


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Log received data
        print(f"Received registration request for username: {username}")

        # Load existing users
        users = load_users()

        # Check if the user already exists
        if username in users:
            return jsonify({"error": "User already exists"}), 400

        # Register the new user
        save_user(username, password)
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"error": "An error occurred during registration"}), 500


# Route to login users
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Log received data
        print(f"Received login request for username: {username}")

        # Load existing users
        users = load_users()

        # Check if credentials are correct
        if username not in users or users[username] != password:
            print(f"Invalid credentials for user: {username}")
            return jsonify({"error": "Invalid credentials"}), 401

        print(f"User {username} logged in successfully.")
        return jsonify({"message": "Login successful", "access_token": "dummy-token"}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

# Serve the React frontend
@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path="index.html"):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
