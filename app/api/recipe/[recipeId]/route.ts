import { connectMongoDB } from "@/app/lib/mongodb";
import { Ingredient } from "@/app/models/ingredient.model";
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

	const url = new URL(req.url);
	const recipeId = url.pathname.split("/").pop() || "";

	if (!recipeId) {
		return Response.json({ error: "Recipe ID is required" }, { status: 400 });
	}

	try {
		const recipe = await fetchRecipeById(recipeId);
		return Response.json({ recipe: recipe }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}
const fetchRecipeById = async (recipeId: string) => {
	await connectMongoDB();
	let recipe = await RecipeModel.findById(recipeId);
	console.log("Recipe from Id Route: ", recipe);

	// fetch all the recipe ingredients from database using Promise all
	if (!recipe) {
		throw new Error("Recipe not found");
	}

	const namedIngredients = await Promise.all(
		recipe.ingredients.map(
			async (ingredient: { _doc: object; ingredientId: string }) => {
				const ingredientName = await Ingredient.findById(
					ingredient.ingredientId
				).then((ing) => ing?.name || "Unknown Ingredient");

				return {
					...ingredient._doc,
					name: ingredientName,
				};
			}
		)
	);

	recipe = { ...recipe._doc, ingredients: namedIngredients };

	console.log("Recipe from Id Route: ", recipe);

	return recipe;
};
