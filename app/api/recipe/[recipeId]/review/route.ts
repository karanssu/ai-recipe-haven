import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Review } from "@/app/models/review.model";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	await connectMongoDB();
	const recipeId = (await params).recipeId;

	// Find all reviews for the given recipe, sorted by most recent
	const reviews = await Review.find({ recipeId: recipeId })
		.sort({ date: -1 })
		.lean();
	return NextResponse.json({ reviews });
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	await connectMongoDB();
	const body = await req.json();
	const recipeId = (await params).recipeId;

	// Body should include userId and review text.
	const reviewDoc = await Review.create({
		recipeId: recipeId,
		userId: body.userId,
		review: body.review,
		date: new Date(),
	});

	return NextResponse.json({ review: reviewDoc }, { status: 201 });
}
