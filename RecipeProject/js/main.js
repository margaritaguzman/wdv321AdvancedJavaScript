document.addEventListener('DOMContentLoaded', () => {
    const recipeCards = document.getElementById('recipe-cards');

    // Prepopulate Local Storage with example recipes
    const exampleRecipes = [
        {
            name: "Pesto Burger",
            image: "images/pesto_burger.jpg",
            description: "A quick and easy meal that is not only tasty, but healthy as well!",
            cookingTime: 45,
            difficulty: "Medium",
            servings: 4,
            ingredients: [
                { quantity: 1, unit: "lb", name: "80% lean ground beef" },
                { quantity: 2, unit: "tbsp", name: "melted butter" },
                { quantity: 1, unit: "tbsp", name: "beef broth" },
                { quantity: 1, unit: "tbsp", name: "pesto"}
            ],
            instructions: [
                "To make the burgers, in a medium sized bowl...",
                "Heat the grill...",
                "Place the burgers on the buns and serve with pesto"
            ]
        },
        {
            name: "Salmon and Veggies",
            image: "images/salmon_and_veggies.jpg",
            description: "A quick and easy meal that is not only tasty, but healthy as well",
            cookingTime: 45,
            difficulty: "Medium",
            servings: 8,
            ingredients: [
                { quantity: 2, unit: "lbs", name: "salmon" },
                { quantity: 1, unit: "cup", name: "veggies" },
                { quantity: 1, unit: "tbsp", name: "butter" }
            ],
            instructions: [
                "Preheat oven to 350°F....",
                "Season salmon and veggies...",
                "Bake for 30-35 minutes."
            ]
        },

        {
            name: "Shrimp Spring Rolls",
            image: "images/shrimp_spring_rolls.jpg",
            description: "A quick and easy meal that is not only tasty, but healthy as well",
            cookingTime: 45,
            difficulty: "Medium",
            servings: 4,
            ingredients: [
                { quantity: 1, unit: "lb", name: "shrimp" },
                { quantity: 1, unit: "lbs", name: "asparagus" },
                { quantity: 1, unit: "tbsp", name: "butter" }
            ],
            instructions: [
                "Heat pan to cook shrimp....",
                "Season shrimp and asparagus...",
                "prepare spring rolls"
            ]
        },

        {
            name: "Veggie Skewers",
            image: "images/veggie_skewers.jpg",
            description: "A quick and easy meal that is not only tasty, but healthy as well",
            cookingTime: 45,
            difficulty: "Easy",
            servings: 4,
            ingredients: [
                { quantity: 1, unit: "cup", name: "Zucchini" },
                { quantity: 1, unit: "cup", name: "Onion" },
                { quantity: 1, unit: "cup", name: "Bell Pepper" },
                { quantity: 1, unit: "cup", name: "butter" }
            ],
            instructions: [
                "Heat grill...",
                "Season veggies and skewer...",
                "cook on gril..."
            ]
        }
    ];

    if (!localStorage.getItem('recipes')) {
        localStorage.setItem('recipes', JSON.stringify(exampleRecipes));
    }

    // Load recipes from local storage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Display recipe cards
    function displayRecipeCards() {
        recipeCards.innerHTML = recipes.map((recipe, index) => `
             <div class="recipe-card" data-id="${index}">
                <img src="${recipe.image}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
            </div>
        `).join('');

        // Add click event listeners to recipe cards
        document.querySelectorAll('.recipe-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                localStorage.setItem('selectedRecipe', JSON.stringify(recipes[index]));
                // Navigate to the recipe details page
                window.location.href = 'recipeDetail.html';
            });
        });
    }

    displayRecipeCards();
});
