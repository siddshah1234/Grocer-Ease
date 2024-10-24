from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import openai
from scraper import findFood

app = Flask(__name__, static_folder='my-app/build')
CORS(app)

# File paths to store user data and grocery lists
USER_DATA_FILE = "my-app/src/users.txt"
GROCERY_DATA_FILE = "my-app/src/grocery_list.txt"  # Updated to use grocery_list.txt

# OpenAI API key setup
openai.api_key = "YOUR_OPENAI_API_KEY"

# Utility function to load users from the file
def load_users():
    users = {}
    try:
        if os.path.exists(USER_DATA_FILE):
            with open(USER_DATA_FILE, 'r') as file:
                for line in file:
                    username, password = line.strip().split(':')
                    users[username] = password
        else:
            print(f"{USER_DATA_FILE} does not exist. Returning an empty user list.")
    except Exception as e:
        print(f"Error loading users: {e}")
    return users

# Utility function to save users to the file
def save_user(username, password):
    try:
        with open(USER_DATA_FILE, 'a') as file:
            file.write(f"{username}:{password}\n")
        print(f"User {username} saved successfully.")
    except Exception as e:
        print(f"Error saving user {username}: {e}")

# Utility function to load grocery list from a file
def load_grocery_list(username):
    grocery_list = []
    try:
        if os.path.exists(GROCERY_DATA_FILE):
            with open(GROCERY_DATA_FILE, 'r') as file:
                for line in file:
                    user, items = line.strip().split(':')
                    if user == username:
                        grocery_list = items.split(',')
                        break
    except Exception as e:
        print(f"Error loading grocery list for {username}: {e}")
    return grocery_list

# Utility function to save grocery list to a file
def save_grocery_list(username, grocery_list):
    try:
        if os.path.exists(GROCERY_DATA_FILE):
            with open(GROCERY_DATA_FILE, 'r') as file:
                lines = file.readlines()
        else:
            lines = []

        with open(GROCERY_DATA_FILE, 'w') as file:
            user_found = False
            for line in lines:
                user, items = line.strip().split(':')
                if user == username:
                    file.write(f"{username}:{','.join(grocery_list)}\n")
                    user_found = True
                else:
                    file.write(line)

            if not user_found:
                file.write(f"{username}:{','.join(grocery_list)}\n")
        print(f"Grocery list for {username} saved successfully.")
    except Exception as e:
        print(f"Error saving grocery list for {username}: {e}")

# Route to register users
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
            print(f"Registration failed: User {username} already exists.")
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
            print(f"Login failed: Invalid credentials for user {username}.")
            return jsonify({"error": "Invalid credentials"}), 401

        print(f"User {username} logged in successfully.")
        return jsonify({"message": "Login successful", "access_token": "dummy-token"}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

# Route to get the grocery list for a user
@app.route('/api/grocery-list/<username>', methods=['GET'])
def get_grocery_list(username):
    try:
        grocery_list = load_grocery_list(username)
        return jsonify({"groceryItems": grocery_list}), 200
    except Exception as e:
        print(f"Error getting grocery list for {username}: {e}")
        return jsonify({"error": "An error occurred while fetching grocery list"}), 500

# Route to update the grocery list for a user
@app.route('/api/grocery-list/<username>', methods=['POST'])
def update_grocery_list(username):
    try:
        data = request.get_json()
        grocery_list = data.get('groceryItems', [])
        save_grocery_list(username, grocery_list)
        return jsonify({"message": "Grocery list updated successfully"}), 200
    except Exception as e:
        print(f"Error updating grocery list for {username}: {e}")
        return jsonify({"error": "An error occurred while updating grocery list"}), 500

# Route to find free food options
@app.route('/free-food/findfood', methods=['POST'])
def freeFood():
    try:
        data = request.get_json()
        zip = data.get('zip')
        distance = data.get('distance')

        print(f"Received Zip: {zip}, Distance: {distance}")

        frees = findFood(str(zip), str(distance))
        print(f"Free food locations: {frees}")
        return jsonify(frees), 200
    except Exception as e:
        print(f"Error in findFood: {e}")
        return jsonify({"error": "An error occurred while finding food"}), 500

# Serve the React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
