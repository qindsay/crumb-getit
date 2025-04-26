import os
from dotenv import load_dotenv
from google import genai
import time
from google.genai import types
import json

# Load environment variables
load_dotenv()

def generate_recipe(ingredients, cuisine):
    """
    Generates a recipe using the Gemini API based on the provided ingredients and cuisine.

    Args:
        ingredients (list): A list of ingredient dictionaries, where each dictionary
            has 'name', 'amount', and 'unit' keys.
        cuisine (str): The type of cuisine for the recipe.

    Returns:
        dict: A dictionary containing the recipe in JSON format, or None if an error occurs.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY is not set in the environment variables.")
        return None

    # Build ingredient list string
    ingredient_list = "\n".join(
        f"- {i['amount']} {i['unit']} {i['name']}" for i in ingredients
    )

    # Build the prompt
    prompt = f"""
    You are a chef. Only use the ingredients and their amounts provided. Do not invent new ingredients.

    Ingredients:
    {ingredient_list}

    Cuisine type: {cuisine}

    Create a recipe. Output ONLY in this JSON format:

    {{
    "recipe_name": "...",
    "servings": ...,
    "ingredients_used": [
        {{"name": "...", "amount": ..., "unit": "..."}}
    ],
    "instructions": [
        "Step 1...",
        "Step 2...",
        "Step 3..."
    ]
    }}

    Make sure the JSON is valid.
    """
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
)
    except Exception as e:
        print(f"Error: Failed to generate content: {e}")
        return None

    if not response.text:
        print("Error: Received an empty response from the model.")
        return None

    # Parse JSON output
    try:
        start_index = response.text.find('{')
        end_index = response.text.rfind('}')
        if start_index != -1 and end_index != -1 and start_index < end_index:
            json_string = response.text[start_index : end_index + 1]
            recipe = json.loads(json_string)
            return recipe
        else:
            print("Error: Could not find valid JSON boundaries in the output.")
            print(response.text)
            return None
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse JSON: {e}")
        print(f"Raw output: {response.text}")
        return None


def generate_video_for_instruction(recipe):
    instructions = recipe["instructions"]
    for step in instructions:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Error: GEMINI_API_KEY is not set in the environment variables.")
            return None
        client = genai.Client(api_key=api_key)

        for step in instructions:
            operation = client.models.generate_videos(
            model="veo-2.0-generate-001",
            prompt=step,
            config=types.GenerateVideosConfig(
                person_generation="dont_allow",  # "dont_allow" or "allow_adult"
                aspect_ratio="16:9",  # "16:9" or "9:16"
            ),
        )

        while not operation.done:
            time.sleep(20)
            operation = client.operations.get(operation)

        for n, generated_video in enumerate(operation.response.generated_videos):
            client.files.download(file=generated_video.video)
            generated_video.video.save(f"video{n}.mp4")  # save the video
    return None

if __name__ == "__main__":
    # Example usage:
    ingredients = [
        {"name": "chicken breast", "amount": 2, "unit": "lbs"},
        {"name": "olive oil", "amount": 2, "unit": "tbsp"},
        {"name": "lemon juice", "amount": 3, "unit": "tbsp"},
        {"name": "garlic", "amount": 2, "unit": "cloves"},
        {"name": "salt", "amount": 1, "unit": "tsp"},
        {"name": "black pepper", "amount": 0.5, "unit": "tsp"},
    ]
    cuisine = "Mediterranean"
    recipe = generate_recipe(ingredients, cuisine)

    if recipe:
        final_recipe = json.dumps(recipe, indent=2)
        print(final_recipe)
        generate_video_for_instruction(recipe)


