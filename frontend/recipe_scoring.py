import os, sys
from dotenv import load_dotenv

from google.generativeai.types import GenerationConfig
import google.generativeai as genai

import json

load_dotenv(dotenv_path='../backend/.env')

API_KEY = os.getenv("GEMINI_API_KEY") 
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set.")
    print("Please obtain an API key from https://aistudio.google.com/app/apikey")
    print("And set the environment variable (e.g., export GEMINI_API_KEY='YOUR_API_KEY')")
    sys.exit(1) 

try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"Error configuring Gemini client: {e}")
    sys.exit(1)

test_recipe = '''{"name": "chicken breast", "amount": 2, "unit": "lbs"},
        {"name": "olive oil", "amount": 2, "unit": "tbsp"},
        {"name": "lemon juice", "amount": 3, "unit": "tbsp"},
        {"name": "garlic", "amount": 2, "unit": "cloves"},
        {"name": "salt", "amount": 1, "unit": "tsp"},
        {"name": "black pepper", "amount": 0.5, "unit": "tsp"'''

def score_recipe(recipe):
    
    context = """You're scoring recipes based on how much environmental impact they have. 
    Formula: Sustainability Score = (weight_carbon * carbon_subscore) + (weight_land * land_subscore) + 
    (weight_water * water_subscore) + (weight_antibiotics * antibiotics_subscore) + (weight_soil * soil_subscore).
    Use web data to calculate weights and subscores, give a score out of 10. Only output the score and brief 
    reasoning in this exact JSON format. 
    The JSON object must follow this exact structure: 
    { 
      "score": <float>,
      "reasoning": "...",
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