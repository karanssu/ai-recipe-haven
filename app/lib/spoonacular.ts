import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&sortDirection=desc&offset=0&number=20

// I want to create a function that will create data.json file if it doesn't exist
// and if it does exist, it will append the data to the file
// the format is as follows:
// {
//   "recipes": [] <- this is an array of recipes where each recipe is an object here will the data be appended
// }
// function will be called saveRecipes
// it will take in an array of recipes

export const saveRecipes = (recipes: object[]) => {
	const dirPath = path.dirname(fileURLToPath(import.meta.url));
	const filePath = path.join(dirPath, "data.json");

	let data = { recipes: [] as object[] };

	if (fs.existsSync(filePath)) {
		data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	}

	data.recipes.push(...recipes);

	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
