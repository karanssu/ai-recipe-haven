import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe } from "@/app/models/recipe.model";
import "@/app/models/rating.model";
import { Types } from "mongoose";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ recipeId: string; userId: string }> }
) {
	try {
		await connectMongoDB();
		const { recipeId, userId } = await params;

		// Validate recipeId and userId
		if (!Types.ObjectId.isValid(recipeId) || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json(
				{ error: "Invalid recipeId or userId" },
				{ status: 400 }
			);
		}

		// Find the recipe and populate its ratings
		const recipe = await Recipe.findById(recipeId).populate("ratings");
		if (!recipe) {
			return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
		}

		// Find the rating that belongs to this user
		let rating = recipe.ratings.find(
			(r: { userId: Types.ObjectId }) => r.userId.toString() === userId
		);
		if (!rating) {
			rating = 0;
		}

		return NextResponse.json({ rating });
	} catch (err) {
		console.error("[GET_RATING_ERROR]:", err);
		return NextResponse.json(
			{ error: "Failed to get rating" },
			{ status: 500 }
		);
	}
}
