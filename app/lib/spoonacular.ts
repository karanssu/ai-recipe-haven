import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&sortDirection=desc&offset=0&number=20

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
