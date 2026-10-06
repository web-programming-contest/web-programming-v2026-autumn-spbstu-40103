export class Recipe {
  constructor(title, ingredients = [], steps = []) {
    this.title = title;
    this.ingredients = [...ingredients];
    this.steps = [...steps];
  }

  addIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  removeIngredient(ingredient) {
    this.ingredients = this.ingredients.filter((item) => item !== ingredient);
  }

  get ingredientCount() {
    return this.ingredients.length;
  }
}

export function groupRecipesByIngredientCount(recipes) {
  const groups = new Map();

  for (const recipe of recipes) {
    const count = recipe.ingredients.length;

    if (!groups.has(count)) {
      groups.set(count, []);
    }

    groups.get(count).push(recipe);
  }

  return groups;
}

export function getUniqueIngredients(recipes) {
  const ingredients = new Set();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      ingredients.add(ingredient);
    }
  }

  return ingredients;
}

export function findRecipesByIngredient(recipes, ingredient) {
  return recipes.filter((recipe) => recipe.ingredients.includes(ingredient));
}

export function groupRecipesByStepCount(recipes) {
  const groups = new Map();

  for (const recipe of recipes) {
    const count = recipe.steps.length;

    if (!groups.has(count)) {
      groups.set(count, []);
    }

    groups.get(count).push(recipe);
  }

  return groups;
}

export function getRecipeTitles(recipes) {
  return recipes.map((recipe) => recipe.title);
}
