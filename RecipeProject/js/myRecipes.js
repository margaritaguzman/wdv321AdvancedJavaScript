document.addEventListener('DOMContentLoaded', () => {
    const myRecipeCards = document.getElementById('recipe-cards');
    // Load recipes from local storage
    const recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];

    // Display user's recipe cards
    function displayMyRecipeCards() {
        myRecipeCards.innerHTML = recipes.map((recipe, index) => `
              <div class="recipe-card" data-id="${index}">
                <img src="${recipe.image}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
            </div>
        `).join('');

        // Add click event listeners to recipe cards
        document.querySelectorAll('.recipe-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                // Save the selected recipe to localStorage
                localStorage.setItem('selectedRecipe', JSON.stringify(recipes[index]));
                // Navigate to the recipe details page
                window.location.href = 'recipeDetail.html';
            });
        });
    }

    displayMyRecipeCards();
});
