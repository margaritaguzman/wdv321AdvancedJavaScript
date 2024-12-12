document.addEventListener('DOMContentLoaded', () => {
    const recipeDetail = document.getElementById('recipe-detail');
    // Load the selected recipe from localStorage
    const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));


    if (recipe) {
        recipeDetail.innerHTML = `
             <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}">
            <p>${recipe.description}</p>
        `;

        // Set preparation/cooking time and difficulty
        const prepTimeValue = document.querySelector('#prep-time span'); 
        const difficultyValue = document.querySelector('#difficulty span');

        prepTimeValue.textContent = recipe.cookingTime || "Unknown";
        difficultyValue.textContent = recipe.difficulty || "Not specified";

        const ingredientsList = document.getElementById('ingredients-list');
        const instructionsList = document.getElementById('instructions-list');
        const servingsSelect = document.getElementById('servingsSelect');
        const currentServingsDisplay = document.getElementById('current-servings');


        // Initialize with the recipe's default servings and cooking time
        let currentServings = recipe.servings;
        const originalPrepTime = recipe.cookingTime || 0; // Initialize cooking time (fallback to 0 if undefined)

        currentServingsDisplay.textContent = currentServings;



        function updateIngredients(multiplier) {
            ingredientsList.innerHTML = recipe.ingredients.map(ing => 
                `<li>${ing.quantity * multiplier} ${ing.unit} ${ing.name}</li>`
            ).join('');

            // Update cooking time
            const adjustedPrepTime = Math.round(originalPrepTime * multiplier);
            prepTimeValue.textContent = adjustedPrepTime;
        }

        // Event listener for servings adjustment
        servingsSelect.addEventListener('change', () => {
            const multiplier = parseFloat(servingsSelect.value);
            currentServings = Math.round(recipe.servings * multiplier); // Update displayed servings
            currentServingsDisplay.textContent = currentServings; // Reflect new servings in the UI
            updateIngredients(multiplier); // Adjust ingredients
        });


        function updateInstructions() {
            instructionsList.innerHTML = recipe.instructions.map(inst => 
                `<li>${inst}</li>`
            ).join('');
        }

        servingsSelect.addEventListener('change', () => {
            const multiplier = parseFloat(servingsSelect.value);
            updateIngredients(multiplier);
        });

        // Show/Hide functionality
        document.getElementById('toggle-ingredients').addEventListener('click', () => {
            ingredientsList.classList.toggle('hidden');
            const btn = document.getElementById('toggle-ingredients');
            btn.innerText = ingredientsList.classList.contains('hidden') ? 'Show Ingredients' : 'Hide Ingredients';
            
        });

        document.getElementById('toggle-instructions').addEventListener('click', () => {
            instructionsList.classList.toggle('hidden');
            const btn = document.getElementById('toggle-instructions');
            btn.innerText = instructionsList.classList.contains('hidden') ? 'Show Instructions' : 'Hide Instructions';
        });

        updateIngredients(1);
        updateInstructions();

    } else {
        recipeDetail.innerHTML = '<p>Recipe not found.</p>';
    }
});
