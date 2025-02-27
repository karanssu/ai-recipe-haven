import { connectMongoDB } from "@/app/lib/mongodb";
import { Rating as RatingModel } from "@/app/models/rating.model";
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

	try {
		const recipes = await fetchRecipeCardData();
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}
const fetchRecipeCardData = async () => {
	await connectMongoDB();
	const recipes = await RecipeModel.find({}).limit(10).populate("ratings");

	const recipeCardData = recipes.map((recipe) => ({
		_id: recipe._id,
		apiId: recipe.apiId,
		imageUrl: recipe.imageUrl,
		tags: recipe.tags,
		name: recipe.name,
		ratings: recipe.ratings,
		serving: recipe.serving,
		calories: recipe.calories,
		preparationMinutes: recipe.preparationMinutes,
		cookingMinutes: recipe.cookingMinutes,
	}));

	for (let i = 0; i < recipeCardData.length; i++) {
		const recipe = recipeCardData[i];
		recipe.ratings = await RatingModel.find({ _id: { $in: recipe.ratings } });
	}

	return recipeCardData;
};
