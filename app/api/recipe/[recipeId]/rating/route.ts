import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe } from "@/app/models/recipe.model";
import { Rating } from "@/app/models/rating.model";
import { Types } from "mongoose";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	try {
		await connectMongoDB();
		const { recipeId } = await params;
		const { userId, rating } = await req.json();

		// Validate rating value
		if (typeof rating !== "number" || rating < 1 || rating > 5) {
			return NextResponse.json(
				{ error: "Rating must be a number between 1 and 5" },
				{ status: 400 }
			);
		}

		// Validate recipeId and userId formats
		if (!Types.ObjectId.isValid(recipeId) || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json(
				{ error: "Invalid recipeId or userId" },
				{ status: 400 }
			);
		}

		// Find the recipe and populate ratings
		const recipe = await Recipe.findById(recipeId).populate("ratings");
		if (!recipe) {
			return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
		}

		const userIdObj = new Types.ObjectId(userId);
		const alreadyRated = recipe.ratings.some((r: { userId: Types.ObjectId }) =>
			r.userId.equals(userIdObj)
		);

		// if already rated then update the rating
		if (alreadyRated) {
			const existingRating = recipe.ratings.find(
				(r: { userId: Types.ObjectId }) => r.userId.equals(userIdObj)
			);
			existingRating.rating = rating;
			await existingRating.save();
			return NextResponse.json({ rating: existingRating }, { status: 200 });
		}

		// If not rated then create the new rating document and update the recipe
		const newRating = await Rating.create({ userId: userIdObj, rating });
		recipe.ratings.push(newRating._id);
		await recipe.save();

		return NextResponse.json({ rating: newRating }, { status: 201 });
	} catch (err) {
		console.error("[RATE_RECIPE_ERROR]:", err);
		return NextResponse.json(
			{ error: "Failed to submit rating" },
			{ status: 500 }
		);
	}
}
