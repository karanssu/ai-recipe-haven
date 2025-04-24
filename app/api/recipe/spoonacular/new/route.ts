import { RawRecipe, Recipe } from "@/app/lib/definitions";
import { connectMongoDB } from "@/app/lib/mongodb";
import { toTitleCase } from "@/app/lib/recipeUtils";
import { Ingredient } from "@/app/models/ingredient.model";
import { Rating } from "@/app/models/rating.model";
import { Recipe as RecipeModel } from "@/app/models/recipe.model";
import { Types } from "mongoose";

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const url = new URL(req.url);
	const defaultRecipeCount = 8;
	const totalRecipeCount = parseInt(
		url.searchParams.get("number") || defaultRecipeCount.toString()
	);

	const previousRecipeCount = await getTotalApiRecipesCount();
	const rawRecipes = await fetchAPIRecipes(
		previousRecipeCount,
		totalRecipeCount
	);
	try {
		const recipes = await saveRecipesInDB(rawRecipes);
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchAPIRecipes = async (
	previousRecipeCount: number,
	totalRecipeCount: number
) => {
	const startRecipeNum = previousRecipeCount + 1;

	const res = await fetch(
		`https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&sortDirection=desc&offset=${startRecipeNum}&number=${totalRecipeCount}&apiKey=${process.env.SPOONACULAR_API_KEY}`
	);

	const data = await res.json();
	const rawRecipes = data.results;

	return rawRecipes;
};

const saveRecipesInDB = async (rawRecipes: RawRecipe[]) => {
	await connectMongoDB();

	const superAdminId = new Types.ObjectId("676b5c8b79b81a34d4ffd21a");

	const recipes: Recipe[] = [];

	for (const rawRecipe of rawRecipes) {
		const computedRating =
			Math.round((rawRecipe.spoonacularScore / 20) * 2) / 2 || 3.5;

		const ratingDoc = await Rating.create({
			rating: computedRating,
			userId: superAdminId,
		});

		const rawIngredients = rawRecipe.extendedIngredients || [];

		const titleCasedIngredients = rawIngredients.map((ing) => ({
			...ing,
			name: toTitleCase(ing.name.trim()),
		}));

		const uniqueIngredients = titleCasedIngredients.filter(
			(ing, idx, arr) =>
				idx ===
				arr.findIndex(
					(other) => other.name.toLowerCase() === ing.name.toLowerCase()
				)
		);

		const recipeIngredients = await Promise.all(
			uniqueIngredients.map(async (ingredient) => {
				let ingredientDoc = await Ingredient.findOne({
					name: ingredient.name,
				});

				if (!ingredientDoc) {
					ingredientDoc = await Ingredient.create({
						name: ingredient.name,
					});
				}

				return {
					ingredientId: ingredientDoc._id,
					name: ingredient.name,
					quantity: ingredient.measures.us.amount || 1,
					unit: ingredient.measures.us.unitShort || "",
				};
			})
		);

		const cookingSteps =
			rawRecipe.analyzedInstructions[0]?.steps.map((step) => ({
				number: step.number,
				step: step.step,
			})) || [];

		const rawTags = rawRecipe.cuisines.concat(
			rawRecipe.dishTypes,
			rawRecipe.diets
		);

		const tags = Array.from(
			new Set(rawTags.map((t) => toTitleCase(t)).filter(Boolean))
		);

		const recipeObj: Recipe = {
			name: rawRecipe.title || "",
			apiId: rawRecipe.id.toString(),
			imageUrl: rawRecipe.image || "",
			description: rawRecipe.summary || "",
			preparationMinutes: rawRecipe.preparationMinutes || 0,
			cookingMinutes: rawRecipe.cookingMinutes || rawRecipe.readyInMinutes || 0,
			serving: rawRecipe.servings || 1,
			tags,
			ratings: [ratingDoc._id], // Now ratings is an array of ObjectIds
			calories: rawRecipe.nutrition.nutrients.find((n) => n.name === "Calories")
				?.amount,
			fatGrams: rawRecipe.nutrition.nutrients.find((n) => n.name === "Fat")
				?.amount,
			carbsGrams: rawRecipe.nutrition.nutrients.find(
				(n) => n.name === "Carbohydrates"
			)?.amount,
			fiberGrams: rawRecipe.nutrition.nutrients.find((n) => n.name === "Fiber")
				?.amount,
			sugarGrams: rawRecipe.nutrition.nutrients.find((n) => n.name === "Sugar")
				?.amount,
			proteinGrams: rawRecipe.nutrition.nutrients.find(
				(n) => n.name === "Protein"
			)?.amount,
			ingredients: recipeIngredients,
			cookingSteps,
		};

		recipes.push(recipeObj);
	}

	const result = await RecipeModel.insertMany(recipes);
	for (let i = 0; i < result.length; i++) {
		const recipe = result[i];
		recipe.ratings = await Rating.find({ _id: { $in: recipe.ratings } });
	}

	return result;
};

const getTotalApiRecipesCount = async () => {
	await connectMongoDB();

	const totalRecipes = await RecipeModel.countDocuments({
		apiId: { $exists: true },
	});

	if (!totalRecipes) {
		return 0;
	}

	return totalRecipes;
};
