export const recipeDetail = {
  recipe_name: "Creamy Garlic Pasta",
  serving: 4,
  ingredients_used: [
    { name: "Pasta", amount: "400g" },
    { name: "Garlic", amount: "6 cloves" },
    { name: "Heavy Cream", amount: "200ml" },
    { name: "Parmesan", amount: "100g" },
    { name: "Olive Oil", amount: "2 tbsp" },
    { name: "Salt", amount: "to taste" },
    { name: "Black Pepper", amount: "to taste" },
  ],
  instructions: [
    {
      instruction:
        "Boil pasta in salted water until al dente. Reserve 1 cup of pasta water before draining.",
      video_url: "URL_PASTA_BOILING",
    },
    {
      instruction:
        "Sauté minced garlic in olive oil until fragrant and lightly golden.",
      video_url: "URL_GARLIC_SAUTE",
    },
    {
      instruction:
        "Add heavy cream and bring to a gentle simmer. Stir in grated parmesan.",
      video_url: "URL_CREAM_SAUCE",
    },
    {
      instruction:
        "Toss cooked pasta with sauce, adding pasta water as needed for desired consistency.",
      video_url: "URL_FINAL_TOSS",
    },
  ],
  image: "/src/assets/chocolate_lava.png",
  time: "30 min",
  ecobiteScore: 85,
};
