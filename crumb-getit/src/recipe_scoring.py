from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("API_KEY")
client = genai.Client(api_key=api_key)

test_recipe = '''{"name": "chicken breast", "amount": 2, "unit": "lbs"},
        {"name": "olive oil", "amount": 2, "unit": "tbsp"},
        {"name": "lemon juice", "amount": 3, "unit": "tbsp"},
        {"name": "garlic", "amount": 2, "unit": "cloves"},
        {"name": "salt", "amount": 1, "unit": "tsp"},
        {"name": "black pepper", "amount": 0.5, "unit": "tsp"'''

context = "You're scoring recipes based on how much environmental impact they have. \
Formula: Sustainability Score = (weight_carbon * carbon_subscore) + (weight_land * land_subscore) + \
    (weight_water * water_subscore) + (weight_antibiotics * antibiotics_subscore) + (weight_soil * soil_subscore). \
    Use web data to calculate weights and subscores, give a score out of 10. Only output the score and brief reasoning"
# print(List)
response = client.models.generate_content(
    model="gemini-2.5-flash-preview-04-17",
    contents=[context + test_recipe]
)
print(response)