import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Review } from "@/app/models/review.model";
import "@/app/models/recipe.model";
import "@/app/models/user.model";

export async function GET(req: NextRequest) {
	await connectMongoDB();

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "10", 10);
	const skip = (page - 1) * limit;

	const reviews = await Review.find()
		.sort({ date: -1 })
		.skip(skip)
		.limit(limit)
		.populate("userId", "name profileImage")
		.populate("recipeId", "name")
		.lean();

	console.log("Reviews:", reviews);

	const hasMore = reviews.length === limit;
	return NextResponse.json({ reviews, hasMore });
}
