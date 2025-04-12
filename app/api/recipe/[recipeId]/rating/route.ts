import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe } from "@/app/models/recipe.model";
import { Rating } from "@/app/models/rating.model";
import { ObjectId, Types } from "mongoose";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	try {
		await connectMongoDB();
		const recipeId = (await params).recipeId;
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

		// check if rating already exists in recipe.rating list for this user and recipe
		const recipe = await Recipe.findById(recipeId).populate("ratings");
		if (!recipe) {
			return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
		}

		const existingRating = recipe.ratings.find(
			(rating: { userId: ObjectId }) =>
				rating.userId.toString() === userId.toString()
		);

		if (existingRating) {
			return NextResponse.json(
				{ error: "User has already rated this recipe" },
				{ status: 400 }
			);
		}

		// Create the new rating document
		const newRating = await Rating.create({
			userId: new Types.ObjectId(userId),
			rating,
			// date: new Date() is set automatically if your schema uses timestamps
		});

		// Avoid duplicates if necessary (depends on your requirements).
		// For now, we simply push the rating
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
