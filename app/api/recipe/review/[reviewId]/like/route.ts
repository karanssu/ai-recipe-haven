import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Types } from "mongoose";
import { Review } from "@/app/models/review.model";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ reviewId: string }> }
) {
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
		const reviewId = (await params).reviewId;
		const { userId } = await req.json();

		if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
		}

		const review = await Review.findById(reviewId);
		if (!review) {
			return NextResponse.json({ error: "Review not found" }, { status: 404 });
		}

		const alreadyLiked = review.likes.some((like: Types.ObjectId) =>
			like.equals(userId)
		);

		if (alreadyLiked) {
			// Unlike
			review.likes.pull(userId);
		} else {
			// Like
			review.likes.push(userId);
		}

		await review.save();

		return NextResponse.json({
			success: true,
			message: alreadyLiked ? "Review unliked" : "Review liked",
			updatedLikes: review.likes,
		});
	} catch (err) {
		console.error("[LIKE_REVIEW_ERROR]:", err);
		return NextResponse.json(
			{ error: "Failed to like/unlike review" },
			{ status: 500 }
		);
	}
}
