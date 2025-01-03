import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const saveRecipesInFile = (recipes: object[]) => {
	const fileName = "data.json";
	const dirPath = path.dirname(fileURLToPath(import.meta.url));
	const filePath = path.join(dirPath, fileName);

	let data = { recipes: [] as object[] };

	if (fs.existsSync(filePath)) {
		data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	}

	data.recipes.push(...recipes);

	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const calculateRecipeRating = (
	ratings: { rating: number }[] | undefined
) => {
	if (!ratings) return 0;

	const ratingsCount = ratings.length;
	if (ratingsCount === 0) return 0;
	const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
	return Math.round((sum / ratingsCount) * 2) / 2;
};

export const getDisplayCaloriesWithUnit = (
	calories: number
): { calories: number; unit: string } => {
	let unit = "cal";
	if (calories > 1000) {
		calories = calories / 1000;
		unit = "kcal";
	}

	if (calories % 1 !== 0) {
		calories = parseFloat(calories.toFixed(2));
	}

	return { calories, unit };
};

export const getDisplayTotalCookingTimeWithUnit = (
	preparationMinutes: number,
	cookingMinutes: number
): { totalTime: number; unit: string } => {
	let unit = "m";
	let totalMinutes = preparationMinutes + cookingMinutes;
	if (totalMinutes > 60) {
		totalMinutes = totalMinutes / 60;
		unit = "h";
	}

	if (totalMinutes % 1 !== 0) {
		totalMinutes = parseFloat(totalMinutes.toFixed(2));
	}

	return { totalTime: totalMinutes, unit };
};