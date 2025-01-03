import { RecipeCardDef } from "@/app/lib/definitions";
import { saveRecipesInFile } from "@/app/lib/recipeUtils";

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	// https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&sortDirection=desc&offset=0&number=20

	// const lastRecipeNum = await getLastRecipeNum();
	// const recipes = await getRecipes(lastRecipeNum);
	// saveRecipesInFile(recipes);
	// saveRecipesInDB(recipes);
	// return Response.json({ recipes: recipes }, { status: 200 });

	const recipe: RecipeCardDef = {
		_id: "12345",
		image:
			"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		tags: ["tag #1", "tag #2", "tag #3"],
		user: {
			_id: "999",
			username: "api_user",
		},
		name: "API Recipe",
		serving: 100,
		calories: 5123,
		preparationMinutes: 30,
		cookingMinutes: 150,
	};

	const recipes: RecipeCardDef[] = [recipe];

	saveRecipesInFile(recipes);

	// return Response.json(
	// 	{
	// 		errors: { error: "Username already exists" },
	// 	},
	// 	{ status: 500 }
	// );
	return Response.json({ recipes: recipes }, { status: 200 });
}
