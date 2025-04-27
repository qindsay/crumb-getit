import base64
import google.genai as otherGenAi
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

# Configure the Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY")

def find_ingredients(file):
    image_bytes = None
    with open(file, 'rb') as newfile:
        # Read the contents
        # contents = file.read()
        image_bytes = newfile.read()
    
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')

    # Build prompt
    textPrompt = f"""
        You are a fridge expert, and someone has given you an image of their fridge. 
        Tell them how much of each ingredient is in their fridge. Output only ingredients in this exact format: amount unit name
        """
    
    imageContent = base64.b64decode(image_base64)
    
    try:
        client = otherGenAi.Client(api_key=API_KEY)
        
        response = client.models.generate_content(
            model = 'gemini-2.5-flash-preview-04-17',
            contents=[
                textPrompt, 
                types.Part.from_bytes(
                    data=imageContent,
                    mime_type='image/jpeg',
                ),
            ]
        )
        
        return jsonify(response.text)
        
    except Exception as e:
        print(f"Error: Failed to detect ingredients: {e}")
        return None

file = '/Users/lindsayqin/Downloads/fridge_image.jpg'
find_ingredients(file)