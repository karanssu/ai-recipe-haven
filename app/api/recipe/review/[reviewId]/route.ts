import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Review } from "@/app/models/review.model";
import { Types } from "mongoose";

export async function PUT(
	req: Request,
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

	await connectMongoDB();
	const { reviewId } = await params;
	const body = await req.json();
	const { review: newText } = body;

	if (!Types.ObjectId.isValid(reviewId)) {
		return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
	}
	if (typeof newText !== "string" || !newText.trim()) {
		return NextResponse.json(
			{ error: "Review text is required" },
			{ status: 400 }
		);
	}

	const updated = await Review.findByIdAndUpdate(
		reviewId,
		{ review: newText.trim(), date: new Date() },
		{ new: true }
	).lean();

	if (!updated) {
		return NextResponse.json({ error: "Review not found" }, { status: 404 });
	}

	return NextResponse.json({ review: updated }, { status: 200 });
}

export async function DELETE(
	req: Request,
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

	await connectMongoDB();
	const { reviewId } = await params;

	if (!Types.ObjectId.isValid(reviewId)) {
		return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
	}

	await Review.findByIdAndDelete(reviewId).lean();

	return NextResponse.json({ success: true }, { status: 200 });
}
