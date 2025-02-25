import { RawRecipe, Recipe } from "@/app/lib/definitions";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe as RecipeModel } from "@/app/models/recipe.model";

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const totalApiRecipesCount = await getTotalApiRecipesCount();
	console.log("totalApiRecipesCount", totalApiRecipesCount);
	const rawRecipes = await fetchAPIRecipes(totalApiRecipesCount);
	const recipes = parseRecipes(rawRecipes);
	try {
		saveRecipesInDB(recipes);
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchAPIRecipes = async (previousRecipeCount: number) => {
	const startRecipeNum = previousRecipeCount + 1;
	const totalRecipes = 2;

	const res = await fetch(
		`https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&sortDirection=desc&offset=${startRecipeNum}&number=${totalRecipes}&apiKey=${process.env.SPOONACULAR_API_KEY}`
	);

	const data = await res.json();
	const rawRecipes = data.results;

	return rawRecipes;
};

const parseRecipes = (rawRecipes: RawRecipe[]): Recipe[] => {
	const result: Recipe[] = [];

	rawRecipes.forEach((rawRecipe: RawRecipe) => {
		const recipe: Recipe = {
			name: rawRecipe.title || "",
			apiId: rawRecipe.id.toString(),
			imageUrl: rawRecipe.image || "",
			serving: rawRecipe.servings || 1,
			preparationMinutes: rawRecipe.preparationMinutes || 0,
			cookingMinutes: rawRecipe.cookingMinutes || 0,
			// tags: rawRecipe.cuisines.concat(rawRecipe.dishTypes, rawRecipe.diets),
			// ratings: [
			// 	{
			// 		_id: "$generated" + rawRecipe.id,
			// 		rating: Math.round((rawRecipe.spoonacularScore / 20) * 2) / 2 || 3.5,
			// 		userId: rawRecipe.id,
			// 	},
			// ],
			calories: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Calories"
			)?.amount,
			fatGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Fat"
			)?.amount,
			carbsGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Carbohydrates"
			)?.amount,
			fiberGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Fiber"
			)?.amount,
			sugarGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Sugar"
			)?.amount,
			proteinGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Protein"
			)?.amount,
			description: rawRecipe.summary || "",
			// ingredients:
			// 	rawRecipe.extendedIngredients?.map(
			// 		(ingredient: {
			// 			id: number | string;
			// 			name: string;
			// 			measures: { us: { amount: number; unitShort: string } };
			// 		}) => {
			// 			return {
			// 				_id: ingredient.id,
			// 				name: ingredient.name,
			// 				amount: ingredient.measures.us.amount,
			// 				unit: ingredient.measures.us.unitShort,
			// 			};
			// 		}
			// 	) || [],
			// cookingSteps:
			// 	rawRecipe.analyzedInstructions[0]?.steps.map(
			// 		(step: { number: number; step: string }) => {
			// 			return {
			// 				number: step.number,
			// 				step: step.step,
			// 			};
			// 		}
			// 	) || [],
		};
		result.push(recipe);
	});

	return result;
};

const getTotalApiRecipesCount = async () => {
	await connectMongoDB();

	// I want to get the totalnumber of recipes in the database that have an apiId
	const totalRecipes = await RecipeModel.countDocuments({
		apiId: { $exists: true },
	});

	if (!totalRecipes) {
		return 0;
	}

	return totalRecipes;
};

const saveRecipesInDB = async (recipes: Recipe[]) => {
	await connectMongoDB();
	await RecipeModel.insertMany(recipes);
};
