import os
import json
import sys
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import GenerationConfig, HarmCategory, HarmBlockThreshold
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS # Import CORS
import time
from PIL import Image  # Use PIL (Pillow) to process the image in memory
from io import BytesIO

from werkzeug.utils import secure_filename
import base64
import google.generativeai as genai
from google.genai import types
import google.genai as otherGenAi
import requests
from bson import ObjectId  

from pymongo import MongoClient

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")  # Add this to your .env
client = MongoClient(MONGO_URI)
db = client['recipeDB']
recipes_collection = db['recipes']
users_collection = db['users']

# HUGGINGFACE_API_TOKEN = "your_huggingface_token_here"  # Replace with your actual token
# HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base"

# --- Initialization ---

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    print("Please obtain an API key from https://aistudio.google.com/app/apikey")
    print("And set the environment variable (e.g., export GEMINI_API_KEY='YOUR_API_KEY')")
    sys.exit(1)

try:
    genai.configure(api_key=API_KEY)
    print("Gemini API configured successfully.")
except Exception as e:
    print(f"Error configuring Gemini client: {e}")
    sys.exit(1)

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app) # Enable CORS for all routes, allowing requests from your React frontend

# --- Chef Personalities Dictionary ---
# (Copied from previous script)
CHEF_PERSONALITIES = {
    "gordon ramsay": """
You are Gordon Ramsay... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
""",
    "julia child": """
You are Julia Child... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
""",
    "jamie oliver": """
You are Jamie Oliver... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
""",
    "martha stewart": """
You are Martha Stewart... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
""",
    "padma lakshmi": """
You are Padma Lakshmi... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
""",
    "generic chef": """
You are a helpful and encouraging chef... [rest of personality description]
This is the recipe you must help the user complete: {recipe}
"""
}
# --- Safety Settings ---
# Define safety settings to block potentially harmful content
# Adjust these as needed for your application's tolerance level
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

# --- Core Logic Functions ---

# Function to generate recipe (adapted for Flask context)
def generate_recipe_logic(ingredients, cuisine, camera):
    """
    Generates a recipe using the Gemini API based on the provided ingredients and cuisine,
    enforcing JSON output using GenerationConfig.

    Args:
        ingredients (list): A list of ingredient dictionaries.
        cuisine (str): The type of cuisine for the recipe.

    Returns:
        dict: A dictionary containing the recipe in JSON format, or None if an error occurs.
    """
    # API key is already configured globally

    # Build ingredient list string
    print(ingredients)
    if not camera:
        ingredient_list = "\n".join(
            f"- {i.get('amount', '')} {i.get('unit', '')} {i.get('name', 'Unknown Ingredient')}".strip()
            for i in ingredients
        )
    else:
        ingredient_list = ingredients
    
    print(ingredient_list)

    # Build the prompt
    prompt = f"""
    You are a chef. Only use the ingredients and their amounts provided below. Do not invent new ingredients or change amounts unless absolutely necessary for the recipe logic.

    Ingredients:
    {ingredient_list}

    Cuisine type: {cuisine}

    Create a recipe based *only* on the ingredients provided.
    Output ONLY the recipe in valid JSON format.
    The JSON object must follow this exact structure:

    {{
      "recipe_name": "...",
      "servings": <integer>,
      "ingredients_used": [
        {{"name": "...", "amount": <number or string>, "unit": "..."}}
      ],
      "instructions": [
        "Step 1...",
        "Step 2...",
        "Step 3..."
      ]
    }}

    Ensure all ingredients listed in "ingredients_used" were present in the input ingredients list.
    Ensure the JSON is valid. Do not include any text before or after the JSON object (like ```json markdown).
    """

    try:
        model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17')
        generation_config = GenerationConfig(
            response_mime_type="application/json"
        )
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
             # Apply safety settings
        )

        # Check response validity
        if not response.candidates or not response.candidates[0].content or not response.candidates[0].content.parts:
            print("Error: Received an empty or invalid response structure from the model for recipe generation.")
            # print(f"Full response: {response}") # Optional: for debugging
            return None

        generated_text = response.text
        recipe = json.loads(generated_text)
        return recipe

    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse recipe JSON: {e}")
        print(f"Raw output received:\n---\n{repr(generated_text)}\n---")
        return None
    except Exception as e:
        print(f"Error during recipe generation API call: {e}")
        # print(f"Full response: {response}") # Optional: for debugging
        return None

def score_recipe(recipe):
    
    context = """You're scoring recipes based on how much environmental impact they have. 
    Formula: Sustainability Score = (weight_carbon * carbon_subscore) + (weight_land * land_subscore) + 
    (weight_water * water_subscore) + (weight_antibiotics * antibiotics_subscore) + (weight_soil * soil_subscore). 
    weight_carbon = 0.3, weight_land = 0.15, weight_water = 0.15, weight_antibiotics = 0.25, weight_soil = 0.15.
    Use web data to calculate subscores, give a score out of 10. Only output the score in this exact JSON format. 
    The JSON object must follow this exact structure: 
    { 
      "score": <float>
    }"""
        
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17')
        generation_config = GenerationConfig(
            response_mime_type="application/json"
        )
        prompt = context + recipe
        response = model.generate_content(
            prompt, generation_config=generation_config
        )
    except Exception as e:
        print(f"Error: Failed to generate recipe content: {e}")
        return None
    
    return json.loads(response.text)

def find_ingredients(file):
    
    if file.startswith('data:image/jpeg;base64,'):
        file = file.replace('data:image/jpeg;base64,', '')
        
    textPrompt = f"""
        You are a fridge expert, and someone has given you an image of their fridge. 
        Tell them how much of each ingredient is in their fridge. Output only a list of ingredients in this exact format: 
        <name> <amont> <unit> \n
        """
        
    try:
        client = otherGenAi.Client(api_key=API_KEY)
        
        response = client.models.generate_content(
            model = 'gemini-2.5-flash-preview-04-17',
            contents=[
                textPrompt, 
                types.Part.from_bytes(
                    data=file,
                    mime_type='image/jpeg',
                ),
            ]
        )
        return response.text
        
    except Exception as e:
        print(f"Error: Failed to detect ingredients: {e}")
        return None
    

def parse_recipe_strings(raw_data):
    if not raw_data or not isinstance(raw_data, dict) or 'recipeData' not in raw_data:
        raise ValueError('Invalid recipe data format.')

    recipe_data = raw_data['recipeData']
    ingredients_list = recipe_data.get('ingredients_used', [])
    instructions_list = recipe_data.get('instructions', [])

    ingredients_str = '\n'.join(
        f"{item.get('amount', '?')} {item.get('unit', '')} {item.get('name', '')}".strip()
        for item in ingredients_list
    )

    instructions_str = '\n'.join(
        f"{idx+1}. {step}" for idx, step in enumerate(instructions_list)
    )
    return ingredients_str + instructions_str

# Function to get a single chat response (refactored from chat_with_assistant)
def get_chat_response_logic(user_message, recipe_json, personality_name, chat_history=None):
    """
    Gets a single chat response from the Gemini model based on the context.

    Args:
        user_message (str): The user's latest message.
        recipe_json (dict): The recipe context.
        personality_name (str): The name of the chef personality.
        chat_history (list, optional): List of previous turns [{'role':'user'/'model', 'parts': [text]}]. Defaults to None.

    Returns:
        str: The assistant's reply text, or None if an error occurs.
    """
    # Select personality and format system instruction
    personality_key = personality_name.lower()
    if personality_key not in CHEF_PERSONALITIES:
        print(f"Warning: Personality '{personality_name}' not found. Using 'Generic Chef'.")
        personality_key = "generic chef"

    system_instruction_template = CHEF_PERSONALITIES[personality_key]

    try:
        if not isinstance(recipe_json, dict):
            print(f"Error: Invalid recipe_json format. Expected dict, got {type(recipe_json)}")
            return None
        recipe_string = json.dumps(recipe_json, indent=2)
        system_instruction = system_instruction_template.format(recipe=recipe_string)
    except Exception as e:
        print(f"Error formatting system instruction: {e}")
        return None

    try:
        # Initialize the model WITH the system instruction for context
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-04-17',
            system_instruction=system_instruction,
            # safety_settings=safety_settings # Apply safety settings here too
        )

        # Prepare history for the API if provided
        # The API expects history in the format: [{'role': 'user'/'model', 'parts': [text]}]
        api_history = []
        if chat_history:
             for turn in chat_history:
                 role = 'user' if turn.get('sender') == 'user' else 'model'
                 # Ensure message is treated as text part
                 api_history.append({'role': role, 'parts': [str(turn.get('message', ''))]})


        # Start a chat session *with history* if available
        chat = model.start_chat(history=api_history if api_history else None)

        # Send the *new* user message to the chat session
        response = chat.send_message(user_message)

        if not response.candidates or not response.candidates[0].content or not response.candidates[0].content.parts:
            print("Error: Received an empty or invalid response structure from the model for chat.")
            # print(f"Full chat response: {response}") # Optional: for debugging
            return None

        return response.text

    except Exception as e:
        print(f"Error during chat API call: {e}")
        # print(f"Full chat response object on error: {response}") # Optional: for debugging
        return None

# --- Flask API Routes ---

@app.route('/api/save-recipe', methods=['POST'])
def save_recipe():
    data = request.get_json()
    if not data or not all(k in data for k in ("recipe_name", "servings", "ingredients_used", "instructions", "score")):
        return jsonify({"error": "Invalid recipe data"}), 400
    result = recipes_collection.insert_one(data)
    return jsonify({"message": "Recipe saved successfully", "id": str(result.inserted_id)}), 201

@app.route('/api/get-recipes', methods=['GET'])
def get_recipes():
    recipes = list(recipes_collection.find())
    for r in recipes:
        r['_id'] = str(r['_id'])
    return jsonify(recipes), 200

@app.route('/api/delete-recipe/<recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    result = recipes_collection.delete_one({'_id': ObjectId(recipe_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify({"message": "Recipe deleted successfully"}), 200

@app.route('/api/generate-recipe', methods=['POST'])
def api_generate_recipe():
    """API endpoint to generate a recipe."""
    try:
        data = request.get_json()
        
        if not data or 'ingredients' not in data or 'cuisine' not in data:
            return jsonify({"error": "Missing 'ingredients' or 'cuisine' in request body"}), 400

        ingredients = data['ingredients']
        cuisine = data['cuisine']
        camera = data['isPhotoMode']

        if not camera:
            if not isinstance(ingredients, list) or not isinstance(cuisine, str):
                return jsonify({"error": "Invalid data types for 'ingredients' (must be list) or 'cuisine' (must be string)"}), 400

        print(f"Received recipe request: Cuisine={cuisine}, Ingredients={len(ingredients)}") # Log request
        recipe = generate_recipe_logic(ingredients, cuisine, camera)

        if recipe:
            print("Recipe generated successfully.") # Log success
            return jsonify(recipe)
        else:
            print("Failed to have output (logic function returned None).") # Log failure
            return jsonify({"error": "Failed to generate recipe"}), 500

    except Exception as e:
        print(f"Error in /api/generate-recipe: {e}") # Log exception
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500
    
@app.route('/api/score-recipe', methods=['POST'])
def api_score_recipe():
    """API endpoint to score a recipe."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing 'ingredients_used' or 'instructions' in request body"}), 400

        # ingredients = data['ingredients_used']
        # instructions = data['instructions']
        recipe = parse_recipe_strings(data)
        output = score_recipe(recipe)
        score = output['score']
        # print(f"Received score={score}")

        if output:
            print("Score, reasoning generated successfully.") 
            return jsonify(output)
        else:
            print("Failed to output score (logic function returned None).") # Log failure
            return jsonify({"error": "Failed to output score"}), 500

    except Exception as e:
        print(f"Error in /api/score-recipe: {e}") # Log exception
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """API endpoint for chat interaction."""
    try:
        data = request.get_json()
        if not data or 'message' not in data or 'recipe' not in data or 'personality' not in data:
            return jsonify({"error": "Missing 'message', 'recipe', or 'personality' in request body"}), 400

        user_message = data['message']
        recipe_json = data['recipe']
        personality = data['personality']
        # Optional: Get history from request if frontend sends it
        # chat_history = data.get('history', None) # Uncomment if sending history

        if not isinstance(user_message, str) or not isinstance(recipe_json, dict) or not isinstance(personality, str):
             print(user_message)
             print(recipe_json)
             print(personality)
             return jsonify({"error": "Invalid data types for 'message', 'recipe', or 'personality'"}), 400


        print(f"Received chat request: Personality={personality}, Message='{user_message[:50]}...'") # Log request

        # Pass history if you are managing it
        # reply = get_chat_response_logic(user_message, recipe_json, personality, chat_history) # Uncomment if sending history
        reply = get_chat_response_logic(user_message, recipe_json, personality) # Current version without history passing


        if reply:
            print("Chat reply generated successfully.") # Log success
            return jsonify({"reply": reply})
        else:
            print("Failed to generate chat reply (logic function returned None).") # Log failure
            return jsonify({"error": "Failed to get chat response from assistant"}), 500

    except Exception as e:
        print(f"Error in /api/chat: {e}") # Log exception
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

@app.route('/api/register-user', methods=['POST'])
def register_user():
    """Register a new user and initialize their points."""
    try:
        data = request.get_json()

        if not data or 'name' not in data:
            return jsonify({"error": "Missing 'name' field in request"}), 400

        user = {
            "name": data['name'],
            "total_points": 0
        }

        result = users_collection.insert_one(user)

        return jsonify({
            "message": "User registered successfully",
            "user_id": str(result.inserted_id),
            "name": data['name'],
            "total_points": 0
        }), 201

    except Exception as e:
        print(f"Error in /api/register-user: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500


@app.route('/api/validate-and-award', methods=['POST'])
def validate_and_award():
    if 'image' not in request.files or 'recipe_id' not in request.form or 'user_id' not in request.form:
        return jsonify({"error": "Missing image or recipe_id or user_id"}), 400

    file = request.files['image']
    recipe_id = request.form['recipe_id']
    user_id = request.form['user_id']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Get the recipe text
    recipe = recipes_collection.find_one({'_id': ObjectId(recipe_id)})
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    recipe_text = recipe['recipe_name']

    image_bytes = file.read()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')

    textPrompt = f"""
        You are a master chef judging a cooking competition.
        The contestant claims to have made:
        "{recipe_text}"

        Here's the photo of their dish. Reply ONLY with "Match" or "No Match".
    """
    client = otherGenAi.Client(api_key=API_KEY)
    response = client.models.generate_content(
        model = 'gemini-2.0-flash',
        contents=[
            textPrompt,
            types.Part.from_bytes(data=base64.b64decode(image_base64), mime_type='image/jpeg'),
        ]
    )
    if not response.candidates or not response.candidates[0].content or not response.candidates[0].content.parts:
        return jsonify({"error": "Empty model response"}), 500

    result_text = response.text.strip().lower()

    if "match" in result_text and "no" not in result_text:
        points_to_add = recipe.get('score', 0)
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"total_points": points_to_add}}
        )
        return jsonify({"success": True, "message": f"Match! Awarded {points_to_add} points."}), 200
    else:
        return jsonify({"success": False, "message": "No match, no points awarded."}), 200

@app.route('/api/get-points/<user_id>', methods=['GET'])
def get_points(user_id):
    """Return the total points of a user."""
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"total_points": user.get('total_points', 0)}), 200

    except Exception as e:
        print(f"Error in /api/get-points: {e}")
        return jsonify({"error": f"Internal server error: {e}"}), 500

@app.route('/api/get-user', methods=['GET'])
def get_user():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Missing name'}), 400

    user = users_collection.find_one({'name': name})
    if user:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return jsonify({'user': user}), 200
    else:
        return jsonify({'user': None}), 200


@app.route('/api/recognize-ingredients', methods=['POST']) #scans image and outputs ingredients
def api_recognize_ingredients():
    try:
        data = request.get_json()
        image_data = data['image']  # Get the base64 string from the client
        
        ingredients = find_ingredients(image_data)
        print("current ingredients", ingredients)
        return jsonify({"ingredients": ingredients}) #not sure if it's ingredients json
    except Exception as e:
        print(f"Error in /api/recognize-ingredients: {e}") # Log exception
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500
    
# --- Run Flask App ---
if __name__ == '__main__':
    # Runs the Flask development server
    # Make sure to set the host to '0.0.0.0' to make it accessible
    # on your network if running inside a container or VM.
    # Use a specific port, e.g., 5000 or 5001 (React often uses 3000).
    app.run(host='0.0.0.0', port=5001, debug=True) # Use debug=False in production
