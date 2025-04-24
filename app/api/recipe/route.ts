import { connectMongoDB } from "@/app/lib/mongodb";
import { Rating as RatingModel } from "@/app/models/rating.model";
import { Recipe as RecipeModel } from "@/app/models/recipe.model";
import { Ingredient as IngredientModel } from "@/app/models/ingredient.model";
import { NextResponse } from "next/server";
import User from "@/app/models/user.model";
import { toTitleCase } from "@/app/lib/recipeUtils";

export async function POST(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	try {
		await connectMongoDB();
		const {
			name,
			userId,
			imageUrl,
			description,
			preparationMinutes,
			cookingMinutes,
			serving,
			tags,
			ingredients,
			cookingSteps,
		} = await req.json();

		const titleCaseTags = Array.from(
			new Set(
				tags.map((tag: string) => toTitleCase(tag.trim())).filter(Boolean)
			)
		);

		const uniqueIngredients = ingredients.filter(
			(
				ing: { name: string; quantity: number; unit: string },
				idx: number,
				arr: { name: string; quantity: number; unit: string }[]
			) =>
				idx ===
				arr.findIndex(
					(other: { name: string }) =>
						toTitleCase(other.name.trim()) === toTitleCase(ing.name.trim())
				)
		);

		const ingredientIds = [];
		for (const ing of uniqueIngredients) {
			const formattedName = toTitleCase(ing.name.trim());
			let ingredient = await IngredientModel.findOne({ name: formattedName });
			if (!ingredient) {
				ingredient = await IngredientModel.create({ name: formattedName });
			}
			ingredientIds.push({
				ingredientId: ingredient._id,
				quantity: ing.quantity,
				unit: ing.unit,
			});
		}

		// Create the recipe
		const recipe = await RecipeModel.create({
			name,
			userId,
			imageUrl,
			description,
			preparationMinutes,
			cookingMinutes,
			serving,
			tags: titleCaseTags,
			ingredients: ingredientIds,
			cookingSteps,
		});

		return NextResponse.json({ recipe: recipe }, { status: 201 });
	} catch (err) {
		console.error("[CREATE_RECIPE_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to create recipe" },
			{ status: 500 }
		);
	}
}

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
		const rawPage = Number(searchParams.get("page")) || 1;
		const page = rawPage < 1 ? 1 : rawPage;
		const limit = Number(searchParams.get("limit")) || 12;
		const skip = page > 1 ? (page - 1) * limit : 0;

		const search = searchParams.get("search");
		const tag = searchParams.get("filter");
		const sortBy = searchParams.get("sort");

		const recipes = await fetchRecipeCardData(limit, skip, tag, sortBy, search);
		return Response.json({ recipes: recipes }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchRecipeCardData = async (
	limit: number,
	skip: number,
	tag: string | null,
	sortBy: string | null,
	search: string | null
) => {
	await connectMongoDB();

	const query: { tags?: string; name?: { $regex: string; $options: string } } =
		{};
	if (tag) {
		query.tags = tag;
	}
	if (search) {
		query.name = { $regex: search, $options: "i" };
	}

	let recipes;
	if (sortBy === "time") {
		recipes = await RecipeModel.aggregate([
			{ $match: query },
			{
				$addFields: {
					totalTime: { $add: ["$cookingMinutes", "$preparationMinutes"] },
				},
			},
			{ $sort: { totalTime: 1 } },
			{ $skip: skip },
			{ $limit: limit },
		]);
	} else if (sortBy === "rating") {
		recipes = await RecipeModel.aggregate([
			{ $match: query },
			{
				$lookup: {
					from: "ratings",
					localField: "ratings",
					foreignField: "_id",
					as: "ratingObjects",
				},
			},
			{
				$addFields: {
					avgRating: {
						$cond: [
							{ $gt: [{ $size: "$ratingObjects" }, 0] },
							{ $avg: "$ratingObjects.rating" },
							0,
						],
					},
				},
			},
			{ $sort: { avgRating: -1 } },
			{ $skip: skip },
			{ $limit: limit },
		]);
	} else {
		recipes = await RecipeModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("ratings")
			.lean();
	}

	const recipeCardData = recipes.map((recipe) => ({
		_id: recipe._id,
		userId: recipe.userId,
		user: {
			_id: recipe.userId,
			name: "",
			profileImage: "",
			role: "",
		},
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

		const ratingDocs = await RatingModel.find({
			_id: { $in: recipe.ratings },
		}).lean();
		recipe.ratings = ratingDocs;

		const userDoc = (await User.findById(recipe.userId)
			.select("_id name profileImage role")
			.lean()) as {
			_id: string;
			name: string;
			profileImage?: string;
			role: string;
		} | null;

		if (userDoc) {
			recipe.user = {
				_id: userDoc._id.toString(),
				name: userDoc.name,
				profileImage: userDoc?.profileImage || "",
				role: userDoc.role,
			};
		}
	}

	return recipeCardData;
};
