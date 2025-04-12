import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Review } from "@/app/models/review.model";
import "@/app/models/user.model";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	await connectMongoDB();
	const recipeId = (await params).recipeId;

	const reviews = await Review.find({ recipeId: recipeId })
		.populate("userId", "name profileImage")
		.sort({ date: -1 })
		.lean();

	const processedReviews = reviews.map((review) => {
		const { userId, ...rest } = review;
		return { ...rest, user: userId };
	});

	return NextResponse.json({ reviews: processedReviews });
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	await connectMongoDB();
	const body = await req.json();
	const recipeId = (await params).recipeId;

	const reviewDoc = await Review.create({
		recipeId: recipeId,
		userId: body.userId,
		review: body.review,
		date: new Date(),
	});

	return NextResponse.json({ review: reviewDoc }, { status: 201 });
}
