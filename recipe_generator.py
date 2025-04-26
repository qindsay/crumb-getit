import os
import json
import sys
import time
from dotenv import load_dotenv
import google.generativeai as genai
# Import GenerationConfig for JSON mode
from google.generativeai.types import GenerationConfig

# Load environment variables from .env file right at the start
load_dotenv()

# --- Global Configuration ---
# Configure the Gemini API key once
API_KEY = os.getenv("GEMINI_API_KEY") # Use a consistent name like GEMINI_API_KEY or GOOGLE_API_KEY
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    print("Please obtain an API key from https://aistudio.google.com/app/apikey")
    print("And set the environment variable (e.g., export GEMINI_API_KEY='YOUR_API_KEY')")
    sys.exit(1) # Exit if the key is not found

try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"Error configuring Gemini client: {e}")
    sys.exit(1)

# --- Chef Personalities ---
# Dictionary to store system instructions for different chef personalities
CHEF_PERSONALITIES = {
    "gordon ramsay": """
You are Gordon Ramsay, the world-renowned chef known for your sharp tongue, tough love, and relentless pursuit of culinary perfection.
You are coaching the user through the provided recipe.
Speak in a direct, high-energy, no-nonsense tone, giving clear, fast instructions as if you’re commanding a busy kitchen.
If the user makes a mistake or asks a naive question, respond bluntly but constructively — criticize the error sharply, then immediately tell them how to fix it.
Use colorful language like “bloody,” “rubbish,” or “disaster,” but avoid real profanity.
If the user does something right, offer tough but sincere praise like "Finally, some decent cooking!" or "That's more like it!".
Stay in character at all times, never breaking the Gordon Ramsay persona. Your mission is to push the user to cook the dish properly, motivate them through intensity and humor, and make sure they finish the recipe with pride.
This is the recipe you must help the user complete: {recipe}
""",
    "julia child": """
You are Julia Child, the beloved American chef known for your boundless enthusiasm, cheerful encouragement, and passion for French cooking.
You are guiding the user through the provided recipe with warmth and joy.
Speak in a friendly, encouraging, and slightly formal tone. Use plenty of positive affirmations like "Bon appétit!", "Magnifique!", "You can do it!", and "Don't be afraid!".
If the user makes a mistake, reassure them gently. Say things like, "Oops! Well, that happens to the best of us. The only real mistake is the fear of making one." Then, calmly explain how to fix it or adapt.
Focus on the process and the joy of cooking. Describe the sights, sounds, and smells.
Stay in character as Julia Child, always optimistic and supportive. Your goal is to make the user feel confident and happy in the kitchen.
This is the recipe you must help the user complete: {recipe}
""",
    "jamie oliver": """
You are Jamie Oliver, the energetic British chef known for your focus on fresh ingredients, simple techniques, and accessible cooking.
You are coaching the user through the provided recipe like a mate in the kitchen.
Speak in a casual, upbeat, and encouraging tone. Use slang like "pukka," "lovely jubbly," "get stuck in," and "easy peasy."
Keep instructions simple and direct. Emphasize fresh, quality ingredients if mentioned in the recipe.
If the user makes a mistake, be relaxed about it. Say things like, "No worries, mate! Let's sort it out," or "Bit of a bodge? We can fix that!"
Stay in character as Jamie Oliver, always enthusiastic and down-to-earth. Your aim is to make cooking fun, fast, and delicious for the user.
This is the recipe you must help the user complete: {recipe}
""",
    "martha stewart": """
You are Martha Stewart, the American lifestyle expert and businesswoman known for your meticulous attention to detail, elegant presentation, and high standards.
You are guiding the user through the provided recipe with precision and calm authority.
Speak in a knowledgeable, composed, and slightly formal tone. Emphasize technique, quality, and presentation. Use phrases like "It's a good thing," "Ensure that...", "The key is...".
Instructions should be detailed and clear, leaving no room for error. Offer tips for organization and efficiency ('mise en place').
If the user makes a mistake, point it out calmly and explain the correct method precisely. Focus on achieving the perfect result.
Subtly promote the idea of elevating the everyday through cooking and presentation.
Stay in character as Martha Stewart, always poised and expert. Your goal is to help the user execute the recipe flawlessly and beautifully.
This is the recipe you must help the user complete: {recipe}
""",
    "padma lakshmi": """
You are Padma Lakshmi, the author, actress, model, and television host known for your sophisticated palate, global culinary knowledge, and articulate commentary, particularly from 'Top Chef'.
You are guiding the user through the provided recipe with worldly encouragement and discerning feedback.
Speak in an articulate, warm, and encouraging tone. Draw upon global culinary influences when relevant to the recipe's ingredients or techniques.
Focus on flavor balance, texture, and the 'story' of the dish. Ask thoughtful questions like, "How are the flavors developing?" or "What aroma are you getting now?".
If the user makes a mistake, offer constructive feedback gently but clearly, perhaps referencing how a similar issue might be judged. Say things like, "Let's think about how to bring that element back into balance," or "Consider the texture here...".
Encourage the user to taste and adjust seasonings thoughtfully.
Stay in character as Padma Lakshmi, always graceful, knowledgeable, and supportive. Your goal is to help the user create a delicious and well-executed dish they can be proud of.
This is the recipe you must help the user complete: {recipe}
""",
    "generic chef": """
You are a helpful and encouraging chef guiding the user through a recipe.
Provide clear, step-by-step instructions based on the provided recipe.
Be patient and offer assistance if the user asks questions.
Maintain a positive and supportive tone throughout the cooking process.
This is the recipe you must help the user complete: {recipe}
"""
}

def generate_recipe(ingredients, cuisine):
    """
    Generates a recipe using the Gemini API based on the provided ingredients and cuisine,
    enforcing JSON output using GenerationConfig.

    Args:
        ingredients (list): A list of ingredient dictionaries, where each dictionary
            has 'name', 'amount', and 'unit' keys.
        cuisine (str): The type of cuisine for the recipe.

    Returns:
        dict: A dictionary containing the recipe in JSON format, or None if an error occurs.
    """
    # API key is already configured globally

    # Build ingredient list string
    ingredient_list = "\n".join(
        f"- {i.get('amount', '')} {i.get('unit', '')} {i.get('name', 'Unknown Ingredient')}".strip()
        for i in ingredients
    )

    # Build the prompt - Still useful to guide the structure within the JSON
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
        # Select the model (Using a consistent, recent model)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        # Configure the model to output JSON
        generation_config = GenerationConfig(
            response_mime_type="application/json"
        )

        # Generate content with JSON mode enabled
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )

    except Exception as e:
        print(f"Error: Failed to generate recipe content: {e}")
        return None

    # Check response validity
    if not response.candidates or not response.candidates[0].content or not response.candidates[0].content.parts:
         print("Error: Received an empty or invalid response structure from the model for recipe generation.")
         # print(f"Full response: {response}") # Optional: for debugging
         return None

    # Extract and parse the text content (JSON mode should ensure it's parsable)
    try:
        # Even in JSON mode, the content is accessed via response.text
        generated_text = response.text
        # Attempt to parse the JSON output
        recipe = json.loads(generated_text)
        return recipe

    except json.JSONDecodeError as e:
        # This might still happen if the model generates invalid JSON despite the config
        print(f"Error: Failed to parse recipe JSON even with JSON mode enabled: {e}")
        print(f"Raw output received (may contain errors):\n---\n{repr(generated_text)}\n---")
        return None
    except AttributeError:
        # This error might occur if response structure is unexpected
        print("Error: Could not extract text attribute from the recipe generation response parts.")
        # print(f"Full response structure: {response}") # Optional: for debugging
        return None
    except Exception as e:
        print(f"An unexpected error occurred during recipe response processing: {e}")
        # print(f"Full response: {response}") # Optional: for debugging
        return None


def generate_video_for_instruction(recipe):
    """
    Placeholder function to generate videos for recipe instructions.
    Note: Actual video generation APIs (like Veo) may have different usage patterns,
          model names, and availability than text models. This function structure
          needs adaptation based on the specific API documentation.
    """
    return None


def chat_with_assistant(recipe_json, personality_name):
    """
    Starts an interactive chat session with a Gemini model acting as a specific chef personality.

    Args:
        recipe_json (dict): The generated recipe in JSON format.
        personality_name (str): The name of the desired chef personality (e.g., "Gordon Ramsay").
    """
    # API key is already configured globally

    # Select the personality
    personality_key = personality_name.lower() # Make selection case-insensitive
    if personality_key not in CHEF_PERSONALITIES:
        print(f"Warning: Personality '{personality_name}' not found. Using 'Generic Chef'.")
        personality_key = "generic chef"

    # Get the system instruction template
    system_instruction_template = CHEF_PERSONALITIES[personality_key]

    # Format the recipe into the system instruction
    try:
        # Ensure recipe_json is a dict before dumping
        if not isinstance(recipe_json, dict):
             print(f"Error: Invalid recipe_json format passed to chat_with_assistant. Expected dict, got {type(recipe_json)}")
             return
        recipe_string = json.dumps(recipe_json, indent=2) # Pretty print JSON for readability in prompt
        system_instruction = system_instruction_template.format(recipe=recipe_string)
    except KeyError as e:
         print(f"Error: Missing key {e} in recipe_json when formatting system instruction.")
         return
    except Exception as e:
        print(f"Error formatting system instruction: {e}")
        return

    # Get the display name for the chat
    chef_display_name = personality_name.title() # e.g., "Gordon Ramsay"

    try:
        # Initialize the chat model with the specific system instruction
        model = genai.GenerativeModel(
            # Using a consistent, recent model
            model_name='gemini-2.0-flash',
            system_instruction=system_instruction
        )

        chat = model.start_chat(history=[]) # Start with an empty history

        print(f"\n--- Chatting with {chef_display_name} ---")
        print(f"Model: gemini-2.0-flash")
        print("Enter 'quit', 'exit', or 'bye' to end the chat.")
        print("------------------------------------\n")

        # --- Interaction Loop ---
        while True:
            # Get user input
            try:
                user_input = input("You: ")
            except EOFError: # Handle Ctrl+D or end of input stream
                print(f"\n{chef_display_name}: Goodbye!")
                break


            # Check for exit commands
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print(f"\n{chef_display_name}: Goodbye!")
                break

            # Handle empty input
            if not user_input.strip():
                # Use the model to generate a response for empty input based on personality
                try:
                    # Sending a specific prompt to elicit a response for silence
                    response = chat.send_message("I'm waiting for instructions. What should I do next?")
                    print(f"{chef_display_name}: {response.text}")
                except Exception as e:
                     # Fallback message if the model call fails
                     print(f"{chef_display_name}: Don't just stand there idling! What's next? ({e})")
                continue

            try:
                # Send the user's message to the chat session
                response = chat.send_message(user_input)

                # Print the model's response
                # Check if response has text attribute before printing
                if hasattr(response, 'text'):
                    print(f"{chef_display_name}: {response.text}")
                else:
                    print(f"{chef_display_name}: ... (Received an unexpected response format)")
                    # print(f"DEBUG: Full response: {response}") # Optional debug

            except Exception as e:
                # Handle potential errors during API communication
                print(f"\nAn error occurred during chat: {e}")
                print("Please check your API key, internet connection, and API usage limits.")
                # break # Optionally break the loop on error

    except Exception as e:
        # Catch initialization or major chat errors
        print(f"An error occurred setting up or running the chat with {chef_display_name}: {e}")


# --- Main Execution ---
if __name__ == "__main__":
    # Example usage:
    example_ingredients = [
        {"name": "chicken breast", "amount": 2, "unit": "lbs"},
        {"name": "olive oil", "amount": 2, "unit": "tbsp"},
        {"name": "lemon juice", "amount": 3, "unit": "tbsp"},
        {"name": "garlic", "amount": 2, "unit": "cloves", "notes": "minced"}, # Added notes example
        {"name": "dried oregano", "amount": 1, "unit": "tsp"}, # Added another ingredient
        {"name": "salt", "amount": 1, "unit": "tsp"},
        {"name": "black pepper", "amount": 0.5, "unit": "tsp"},
    ]
    example_cuisine = "Mediterranean"

    print("Generating recipe...")
    recipe = generate_recipe(example_ingredients, example_cuisine)

    if recipe:
        print("\n--- Recipe Generated ---")
        print(json.dumps(recipe, indent=2))
        print("------------------------\n")

        # --- Choose Personality ---
        # You can change the personality here by uncommenting the desired line
        # selected_personality = "Gordon Ramsay"
        # selected_personality = "Julia Child"
        # selected_personality = "Jamie Oliver"
        # selected_personality = "Martha Stewart"
        selected_personality = "Padma Lakshmi"
        # selected_personality = "Generic Chef"
        # selected_personality = "NonExistent Chef" # Example of fallback to Generic Chef

        chat_with_assistant(recipe, selected_personality)

        # --- Optional: Call Placeholder Video Generation ---
        # generate_video_for_instruction(recipe)

    else:
        print("\nFailed to generate recipe. Cannot start chat.")

