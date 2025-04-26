import React, { useState, useEffect, useCallback } from 'react';
// Assuming Tailwind CSS is set up in your project

// --- Configuration ---
// Define the backend base URL. Adjust if your backend runs elsewhere.
const BACKEND_URL = 'http://127.0.0.1:5001'; // Use http://localhost:5001 if 127.0.0.1 doesn't work

// Helper function to format ingredients for display or API
const formatIngredients = (ingredients) => {
  // Example: Convert array of objects to a simple list string if needed
  // Or just use the array directly if the API expects that
  return ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`).join(', ');
};

// --- Main App Component ---
function App() {
  // --- State Variables ---
  const [ingredients, setIngredients] = useState([
    { name: 'chicken breast', amount: 2, unit: 'lbs' },
    { name: 'olive oil', amount: 2, unit: 'tbsp' },
    { name: 'lemon juice', amount: 3, unit: 'tbsp' },
    { name: 'garlic', amount: 2, unit: 'cloves' },
    { name: 'dried oregano', amount: 1, unit: 'tsp' },
    { name: 'salt', amount: 1, unit: 'tsp' },
    { name: 'black pepper', amount: 0.5, unit: 'tsp' },
    // Add more initial ingredients or allow user input
  ]);
  const [cuisine, setCuisine] = useState('Mediterranean');
  const [selectedPersonality, setSelectedPersonality] = useState('Gordon Ramsay'); // Default personality
  const [recipe, setRecipe] = useState(null);
  const [score, setScore] = useState(0);
  const [chatHistory, setChatHistory] = useState([]); // Stores { sender: 'user'/'assistant', message: '...' }
  const [userMessage, setUserMessage] = useState('');
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [error, setError] = useState(null);

  // --- Available Personalities (matches Python keys/names) ---
  const personalities = [
    "Gordon Ramsay",
    "Julia Child",
    "Jamie Oliver",
    "Martha Stewart",
    "Padma Lakshmi",
    "Generic Chef"
  ];

  // --- API Call Functions ---

  // Function to generate recipe
  // const handleGenerateRecipe = useCallback(async () => {
  //   setIsLoadingRecipe(true);
  //   setError(null);
  //   setRecipe(null); // Clear previous recipe
  //   setChatHistory([]); // Clear chat on new recipe

  //   console.log("Sending recipe request:", { ingredients, cuisine }); // Log request data

  //   try {
  //     // Use the BACKEND_URL constant
  //     const response1 = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ ingredients, cuisine }),
  //     });

  //      console.log("Recipe response status:", response1.status); // Log response status

  //     if (!response1.ok) {
  //       // --- Error Handling Fix ---
  //       // Read the body ONCE as text first.
  //       const errorText = await response1.text();
  //       let errorMsg = `HTTP error ${response1.status}: ${errorText}`;
  //       try {
  //           // Try to parse the text as JSON for a more specific error message
  //           const errorJson = JSON.parse(errorText);
  //           errorMsg = `HTTP error ${response1.status}: ${errorJson.error || errorText}`;
  //       } catch (parseError) {
  //           // If it's not JSON, use the raw text.
  //           // errorMsg is already set to the text content.
  //       }
  //       throw new Error(errorMsg);
  //       // --- End Error Handling Fix ---
  //     }
      
  //     const data = await response1.json();
  //     console.log("Recipe received:", data); // Log received data
  //     setRecipe(data);

  //     let initialMessage = `Right, let's get cooking this ${data.recipe_name || 'dish'}! What's your first question?`;
  //     setChatHistory([{ sender: 'assistant', message: initialMessage }]);

  //   } catch (err) {
  //     console.error("Failed to generate recipe:", err);
  //     // err.message now contains the detailed error from the backend or fetch failure
  //     setError(`Failed to generate recipe: ${err.message}. Ensure the backend server at ${BACKEND_URL} is running and CORS is enabled.`);
  //   } finally {
  //     setIsLoadingRecipe(false);
  //   }
  // }, [ingredients, cuisine]); // Dependencies for useCallback

  const handleGenerateRecipe = useCallback(async () => {
    setIsLoadingRecipe(true);
    setError(null);
    setRecipe(null); // Clear previous recipe
    setScore(0)
    setChatHistory([]); // Clear chat on new recipe

    console.log("Sending recipe request:", { ingredients, cuisine }); // Log request data

    try {
      // Use the BACKEND_URL constant
      const response1 = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, cuisine }),
      });

       console.log("Recipe response status:", response1.status); // Log response status

      if (!response1.ok) {
        // Read the body ONCE as text first.
        const errorText = await response1.text();
        let errorMsg = `HTTP error ${response1.status}: ${errorText}`;
        try {
            // Try to parse the text as JSON for a more specific error message
            const errorJson = JSON.parse(errorText);
            errorMsg = `HTTP error ${response1.status}: ${errorJson.error || errorText}`;
        } catch (parseError) {
            // If it's not JSON, use the raw text.
        }
        throw new Error(errorMsg);
      }
      
      const recipeData = await response1.json();
      console.log("Recipe received:", recipeData); // Log received data
      setRecipe(recipeData);

      try {
        console.log('Recipe being sent for scoring:', recipeData);
  
        const response2 = await fetch(`${BACKEND_URL}/api/score-recipe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({recipeData})
        });
  
        if (!response2.ok) {
          // --- Error Handling Fix ---
          // Read the body ONCE as text first.
          const errorText = await response2.text();
          let errorMsg = `HTTP error ${response2.status}: ${errorText}`;
          try {
              // Try to parse the text as JSON for a more specific error message
              const errorJson = JSON.parse(errorText);
              errorMsg = `HTTP error ${response2.status}: ${errorJson.error || errorText}`;
              console.error(errorMsg)
          } catch (parseError) {
              // If it's not JSON, use the raw text.
              // errorMsg is already set to the text content.
          }
          throw new Error(errorMsg);
          // --- End Error Handling Fix ---
        }
  
        const scoreData = await response2.json()
        console.log("Score received:", scoreData); // Log received data
        setScore(scoreData['score']);
  
      } catch (err) {
        console.error("Failed to score recipe:", err);
        // err.message now contains the detailed error from the backend or fetch failure
        setError(`Failed to score recipe: ${err.message}. Ensure the backend server at ${BACKEND_URL} is running and CORS is enabled.`);
      }

      let initialMessage = `Right, let's get cooking this ${recipeData.recipe_name || 'dish'}! What's your first question?`;
      setChatHistory([{ sender: 'assistant', message: initialMessage }]);

    } catch (err) {
      console.error("Failed to generate recipe:", err);
      // err.message now contains the detailed error from the backend or fetch failure
      setError(`Failed to generate recipe: ${err.message}. Ensure the backend server at ${BACKEND_URL} is running and CORS is enabled.`);
    } finally {
      setIsLoadingRecipe(false);
    }
  }, [ingredients, cuisine]); // Dependencies for useCallback

  

  // Function to send chat message
  const handleSendMessage = useCallback(async () => {
    if (!userMessage.trim() || !recipe) return; // Don't send empty messages or if no recipe

    const messageToSend = userMessage;
    const currentRecipeContext = recipe; // Capture current recipe state
    const currentPersonality = selectedPersonality; // Capture current personality

    setUserMessage(''); // Clear input field immediately
    setIsLoadingChat(true);
    setError(null);

    // Add user message to history optimistically
    const newUserMessageEntry = { sender: 'user', message: messageToSend };
    setChatHistory(prev => [...prev, newUserMessageEntry]);

    const requestBody = {
        message: messageToSend,
        recipe: currentRecipeContext, // Send the current recipe context
        personality: currentPersonality,
    };

    console.log("Sending chat request:", requestBody); // Log request data

    try {
      // Use the BACKEND_URL constant
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log("Chat response status:", response.status); // Log response status

      if (!response.ok) {
        // --- Error Handling Fix ---
        // Read the body ONCE as text first.
        const errorText = await response.text();
        let errorMsg = `HTTP error ${response.status}: ${errorText}`;
         try {
            // Try to parse the text as JSON for a more specific error message
            const errorJson = JSON.parse(errorText);
            errorMsg = `HTTP error ${response.status}: ${errorJson.error || errorText}`;
        } catch (parseError) {
            // If it's not JSON, use the raw text.
        }
        throw new Error(errorMsg);
         // --- End Error Handling Fix ---
      }

      // If response.ok is true, parse the JSON body
      const data = await response.json();
      console.log("Chat reply received:", data); // Log received data

      // Add assistant response to history
      setChatHistory(prev => [...prev, { sender: 'assistant', message: data.reply }]);

    } catch (err) {
      console.error("Failed to send/receive chat message:", err);
      // err.message now contains the detailed error from the backend or fetch failure
      setError(`Chat error: ${err.message}. Ensure the backend server at ${BACKEND_URL} is running.`);
      // Optional: Remove the optimistically added user message on error
      // setChatHistory(prev => prev.filter(msg => msg !== newUserMessageEntry));
    } finally {
      setIsLoadingChat(false);
    }
  // Include chatHistory in dependencies ONLY if you send it to the backend
  }, [userMessage, recipe, selectedPersonality]); // Dependencies for useCallback

  // --- Render ---
  return (
    <div className="container mx-auto p-4 font-sans bg-gray-50 min-h-screen flex flex-col md:flex-row gap-4">

      {/* --- Left Panel: Inputs & Recipe --- */}
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">Chef Assistant</h1>

        {/* Ingredients Input (Simplified - could be a more complex component) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          {/* Make ingredients editable - Example using textarea */}
           <textarea
             value={ingredients.map(i => `${i.amount || ''} ${i.unit || ''} ${i.name || ''}`.trim()).join('\n')}
             onChange={(e) => {
               const lines = e.target.value.split('\n');
               const newIngredients = lines.map(line => {
                 const parts = line.trim().match(/^([\d./\s]*)\s*([a-zA-Z]*)\s*(.*)$/);
                 // Basic parsing, might need refinement
                 return {
                   amount: parts?.[1]?.trim() || '',
                   unit: parts?.[2]?.trim() || '',
                   name: parts?.[3]?.trim() || ''
                 };
               }).filter(i => i.name); // Filter out empty lines
               setIngredients(newIngredients);
             }}
             rows={ingredients.length + 1} // Adjust rows dynamically
             className="w-full p-2 border rounded-md text-gray-700 whitespace-pre-wrap focus:ring-2 focus:ring-blue-500 focus:outline-none"
             placeholder="Enter ingredients: e.g., 2 lbs chicken breast"
           />
           <p className="text-xs text-gray-500 mt-1">Enter one ingredient per line (amount unit name).</p>
        </div>

        {/* Cuisine Input */}
        <div className="bg-white p-4 rounded-lg shadow">
          <label htmlFor="cuisine" className="block text-xl font-semibold mb-2">Cuisine</label>
          <input
            id="cuisine"
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Italian, Mexican"
          />
        </div>

         {/* Personality Selector */}
        <div className="bg-white p-4 rounded-lg shadow">
            <label htmlFor="personality" className="block text-xl font-semibold mb-2">Chef Personality</label>
            <select
                id="personality"
                value={selectedPersonality}
                onChange={(e) => {
                    setSelectedPersonality(e.target.value);
                    // Optionally clear chat or add a personality change message
                    // setChatHistory([]);
                }}
                className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                {personalities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>

        {/* Generate Recipe Button */}
        <button
          onClick={handleGenerateRecipe}
          disabled={isLoadingRecipe}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoadingRecipe ? 'Generating...' : 'Generate Recipe'}
        </button>

        {/* Display Error Messages */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mt-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}


        {/* Display Recipe */}
        {recipe && !isLoadingRecipe && ( // Only show recipe if not loading and recipe exists
          <div className="bg-white p-4 rounded-lg shadow mt-4 space-y-3">
            <h2 className="text-2xl font-bold text-green-700">{recipe.recipe_name || 'Generated Recipe'}</h2>
            <p><span className="font-semibold">Servings:</span> {recipe.servings || 'N/A'}</p>
            <div>
              <h3 className="font-semibold text-lg mb-1">Ingredients Used:</h3>
              <ul className="list-disc list-inside ml-4">
                {recipe.ingredients_used?.length > 0 ? recipe.ingredients_used.map((ing, index) => (
                  <li key={index}>{`${ing.amount || ''} ${ing.unit || ''} ${ing.name || 'Unknown'}`.trim()}</li>
                )) : <li>No ingredients listed.</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Instructions:</h3>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                 {recipe.instructions?.length > 0 ? recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                )) : <li>No instructions provided.</li>}
              </ol>
            </div>
          </div>
        )}
      </div>

      <div>
      <ol className="list-decimal list-inside ml-4 space-y-1">Score: {score}</ol>
      </div>
      {/* --- Right Panel: Chat --- */}
      <div className="md:w-1/2 flex flex-col bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 border-b pb-2">{selectedPersonality} Assistant</h2>
        {/* Chat History Area */}
        <div className="flex-grow overflow-y-auto mb-4 h-64 md:h-[50vh] lg:h-[60vh] border rounded-md p-3 bg-gray-50 space-y-3 scroll-smooth"> {/* Added scroll-smooth */}
          {chatHistory.length === 0 && recipe && !isLoadingRecipe && (
             <p className="text-gray-500 italic text-center p-4">Recipe generated. Ask the chef a question!</p>
          )}
           {chatHistory.length === 0 && !recipe && !isLoadingRecipe && (
             <p className="text-gray-500 italic text-center p-4">Generate a recipe to start chatting.</p>
          )}
           {isLoadingRecipe && ( // Show loading message while recipe generates
             <p className="text-gray-500 italic text-center p-4">Generating recipe...</p>
           )}
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`py-2 px-3 rounded-lg max-w-xs lg:max-w-md shadow-sm ${chat.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                 {/* Basic Markdown-like rendering for newlines */}
                {chat.message.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                ))}
              </div>
            </div>
          ))}
           {/* Typing indicator */}
           {isLoadingChat && (
             <div className="flex justify-start">
                <div className="py-2 px-3 rounded-lg bg-gray-200 text-gray-500 italic animate-pulse"> {/* Added animate-pulse */}
                    {selectedPersonality} is typing...
                </div>
             </div>
           )}
            {/* Add a ref to scroll to bottom */}
            <div ref={(el) => { el?.scrollIntoView({ behavior: 'smooth' }); }}></div>
        </div>
        {/* Chat Input Area */}
        <div className="flex gap-2 border-t pt-3">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoadingChat && handleSendMessage()}
            className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            placeholder={recipe ? `Ask ${selectedPersonality}...` : "Generate a recipe first"}
            disabled={!recipe || isLoadingChat || isLoadingRecipe} // Disable input while recipe is loading too
          />
          <button
            onClick={handleSendMessage}
            disabled={!recipe || isLoadingChat || isLoadingRecipe || !userMessage.trim()} // Disable button while recipe is loading
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            aria-label="Send chat message" // Accessibility
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}

export default App; // Ensure App is exported as default
