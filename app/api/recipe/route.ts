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
		const { searchParams } = new URL(req.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 12;
		const skip = page > 1 ? (page - 1) * limit : 0;

		const recipes = await fetchRecipeCardData(limit, skip);
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchRecipeCardData = async (limit: number, skip: number) => {
	await connectMongoDB();
	const recipes = await RecipeModel.find({})
		.skip(skip)
		.limit(limit)
		.populate("ratings")
		.lean();

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
