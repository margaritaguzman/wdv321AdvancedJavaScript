document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-recipe-form');
    const ingredientsField = document.getElementById('ingredients');
    const instructionsField = document.getElementById('instructions');
    let ingredientCounter = 0; // Counter to ensure unique IDs for ingredients
    let instructionCounter = 0; // Counter to ensure unique IDs for instructions
  
    // Dynamically add ingredient fields with unique IDs
    document.getElementById('add-ingredient').addEventListener('click', () => {
      const ingredientDiv = document.createElement('div');
      ingredientDiv.innerHTML = `
        <label for="quantity-${ingredientCounter}">Quantity:</label>
        <input type="number" id="quantity-${ingredientCounter}" name="quantity" placeholder="Quantity">
        <label for="unit-${ingredientCounter}">Unit:</label>
        <input type="text" id="unit-${ingredientCounter}" name="unit" placeholder="Unit">
        <label for="ingredient-${ingredientCounter}">Ingredient:</label>
        <input type="text" id="ingredient-${ingredientCounter}" name="ingredient" placeholder="Ingredient">
        <button type="button" class="remove-item">Remove</button>
      `;
      ingredientsField.insertBefore(ingredientDiv, ingredientsField.lastElementChild);
      ingredientCounter++; // Increment counter for the next ingredient field
    });
  
    // Dynamically add instruction fields with unique IDs
    document.getElementById('add-instruction').addEventListener('click', () => {
      const instructionDiv = document.createElement('div');
      instructionDiv.innerHTML = `
        <label for="instruction-${instructionCounter}">Instruction Step:</label>
        <textarea id="instruction-${instructionCounter}" name="instruction" placeholder="Instruction step"></textarea>
        <button type="button" class="remove-item">Remove</button>
      `;
      instructionsField.insertBefore(instructionDiv, instructionsField.lastElementChild);
      instructionCounter++; // Increment counter for the next instruction field
    });
  
    form.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        e.target.parentElement.remove();
      }
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      if (validateInfo()) {
        const myRecipes = {
          name: document.getElementById('recipe-name').value,
          image: `images/${document.getElementById('recipe-image').value}`,
          description: document.getElementById('recipe-description').value,
          cookingTime: parseInt(document.getElementById('cooking-time').value, 10) || 0,
          difficulty: document.getElementById('difficulty').value,
          servings: 4,
          ingredients: [],
          instructions: [],
        };
  
        // Process dynamically added ingredient fields
        ingredientsField.querySelectorAll('div').forEach((div) => {
          const quantity = parseFloat(div.querySelector('input[name="quantity"]').value) || 0;
          const unit = div.querySelector('input[name="unit"]').value.trim();
          const ingredientName = div.querySelector('input[name="ingredient"]').value.trim();
          if (quantity > 0 && unit && ingredientName) {
            myRecipes.ingredients.push({
              quantity,
              unit,
              name: ingredientName,
            });
          }
        });
  
        // Process dynamically added instruction fields
        instructionsField.querySelectorAll('div textarea').forEach((textarea) => {
          const text = textarea.value.trim();
          if (text) {
            myRecipes.instructions.push(text);
          }
        });
  
        const newRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
        newRecipes.push(myRecipes);
        localStorage.setItem('myRecipes', JSON.stringify(newRecipes));
  
        alert('Recipe added successfully!');
        form.reset();
      }
    });
  
    function validateInfo() {
      let recipeName = document.getElementById('recipe-name').value.trim();
      let recipeDescription = document.getElementById('recipe-description').value.trim();
      let cookingTime = document.getElementById('cooking-time').value.trim();
      let difficulty = document.getElementById('difficulty').value.trim();
  
      // Ensure fields are valid
      if (!recipeName) {
        alert('Please enter a recipe name!');
        return false;
      }
  
      if (!recipeDescription) {
        alert('Please enter a recipe description!');
        return false;
      }
  
      if (!cookingTime || isNaN(cookingTime) || parseInt(cookingTime) <= 0) {
        alert('Cooking time must be a valid number!');
        return false;
      }
  
      if (!difficulty) {
        alert('Please select a difficulty!');
        return false;
      }
  
      // Ensure at least one ingredient exists
      const ingredientInputs = document.querySelectorAll('#ingredients div input[name="ingredient"]');
      let hasIngredient = false;
  
      for (let input of ingredientInputs) {
        if (input.value.trim()) {
          hasIngredient = true;
          break;
        }
      }
  
      if (!hasIngredient) {
        alert('You must add at least one ingredient!');
        return false;
      }
  
      // Ensure at least one instruction exists
      const instructionInputs = document.querySelectorAll('#instructions div textarea');
      let hasInstruction = false;
  
      for (let textarea of instructionInputs) {
        if (textarea.value.trim()) {
          hasInstruction = true;
          break;
        }
      }
  
      if (!hasInstruction) {
        alert('You must add at least one instruction!');
        return false;
      }
  
      return true;
    };
  });
  