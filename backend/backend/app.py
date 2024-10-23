from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import openai
from scraper import findFood

app = Flask(__name__, static_folder='my-app/build')
CORS(app)

# File path to store user data, grocery lists, and budgets
USER_DATA_FILE = "my-app/src/users.txt"
GROCERY_DATA_FILE = "my-app/src/grocery_data.txt"

# OpenAI API key setup
openai.api_key = "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"

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

# Utility function to load grocery lists and budgets from the file
def load_grocery_data():
    grocery_data = {}
    if os.path.exists(GROCERY_DATA_FILE):
        with open(GROCERY_DATA_FILE, 'r') as file:
            for line in file:
                username, data = line.strip().split(':', 1)
                grocery_data[username] = eval(data)  # Convert string back to dictionary
    return grocery_data

# Utility function to save grocery lists and budgets to the file
def save_grocery_data(username, grocery_list, budget):
    grocery_data = load_grocery_data()
    grocery_data[username] = {'grocery_list': grocery_list, 'budget': budget}
    with open(GROCERY_DATA_FILE, 'w') as file:
        for user, data in grocery_data.items():
            file.write(f"{user}:{data}\n")

# Route to get a user's grocery list and budget
@app.route('/api/grocery-list/<username>', methods=['GET'])
def get_grocery_list(username):
    grocery_data = load_grocery_data()
    user_data = grocery_data.get(username, {'grocery_list': [], 'budget': 0})
    total_cost = sum(item['cost'] for item in user_data['grocery_list'])
    return jsonify({'groceryItems': user_data['grocery_list'], 'totalCost': total_cost, 'budget': user_data['budget']})

# Route to update a user's grocery list and budget
@app.route('/api/grocery-list/<username>', methods=['POST'])
def update_grocery_list(username):
    grocery_list = request.json.get('items', [])
    budget = request.json.get('budget', 0)
    save_grocery_data(username, grocery_list, budget)
    return jsonify({'message': 'Grocery list and budget updated successfully'})

# Route to remove an item from the grocery list
@app.route('/api/grocery-list/remove-item/<username>', methods=['POST'])
def remove_grocery_item(username):
    item_to_remove = request.json.get('item')
    grocery_data = load_grocery_data()
    
    if username in grocery_data:
        grocery_list = grocery_data[username].get('grocery_list', [])
        updated_list = [item for item in grocery_list if item['name'] != item_to_remove]
        grocery_data[username]['grocery_list'] = updated_list
        save_grocery_data(username, updated_list, grocery_data[username]['budget'])
        return jsonify({'message': 'Item removed successfully', 'groceryList': updated_list}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Route to evaluate grocery list using OpenAI
@app.route('/api/evaluate-grocery-list', methods=['POST'])
def evaluate_grocery_list():
    try:
        data = request.get_json()
        grocery_list = data.get('groceryList', [])
        total_cost = data.get('totalCost', 0)

        # Convert the grocery list to a string for the OpenAI prompt
        grocery_items = "\n".join([f"{item['name']} (Cost: {item['cost']})" for item in grocery_list])

        prompt = f"Evaluate the following grocery list based on cost and healthiness:\n{grocery_items}\nTotal cost is ${total_cost}.\nPlease suggest improvements to make the list more cost-effective and healthier."

        # Call OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )

        suggestions = response.choices[0].text.strip()

        return jsonify({"evaluation": suggestions}), 200
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return jsonify({"error": "An error occurred during evaluation"}), 500

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

# Route to find free food options
@app.route('/free-food/findfood', methods=['POST'])
def freeFood():
    try:
        data = request.get_json()
        zip = data.get('zip')
        distance = data.get('distance')

        print(f"Received Zip: {zip}, Distance: {distance}")

        frees = findFood(str(zip), str(distance))
        print(frees)
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
