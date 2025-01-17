import { RawRecipe, Recipe } from "@/app/lib/definitions";
// import { saveRecipesInFile } from "@/app/lib/recipeUtils";

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	// const lastRecipeNum = await getLastRecipeNum();
	const lastRecipeNum = 4000;

	const rawRecipes = await fetchAPIRecipes(lastRecipeNum);
	// saveRecipesInFile(rawRecipes);
	const recipes = parseRecipes(rawRecipes);
	try {
		// saveRecipesInDB(recipes);
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchAPIRecipes = async (lastRecipeNum: number) => {
	const startRecipeNum = lastRecipeNum + 1;
	const totalRecipes = 10;

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
			_id: rawRecipe.id,
			name: rawRecipe.title || "",
			image: rawRecipe.image || "",
			serving: rawRecipe.servings || 1,
			preparationMinutes: rawRecipe.preparationMinutes || 0,
			cookingMinutes: rawRecipe.cookingMinutes || 0,
			userId: "$generated" + rawRecipe.id,
			tags: rawRecipe.cuisines.concat(rawRecipe.dishTypes, rawRecipe.diets),
			ratings: [
				{
					_id: "$generated" + rawRecipe.id,
					rating: Math.round((rawRecipe.spoonacularScore / 20) * 2) / 2 || 3.5,
					userId: rawRecipe.id,
				},
			],
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
			ingredients:
				rawRecipe.extendedIngredients?.map(
					(ingredient: {
						id: number | string;
						name: string;
						measures: { us: { amount: number; unitShort: string } };
					}) => {
						return {
							_id: ingredient.id,
							name: ingredient.name,
							amount: ingredient.measures.us.amount,
							unit: ingredient.measures.us.unitShort,
						};
					}
				) || [],
			cookingSteps:
				rawRecipe.analyzedInstructions[0]?.steps.map(
					(step: { number: number; step: string }) => {
						return {
							number: step.number,
							step: step.step,
						};
					}
				) || [],
		};
		result.push(recipe);
	});

	return result;
};
