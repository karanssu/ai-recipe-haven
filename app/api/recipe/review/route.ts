import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Review } from "@/app/models/review.model";
import "@/app/models/recipe.model";
import "@/app/models/user.model";
import { Types } from "mongoose";

interface RawReview {
	_id: Types.ObjectId;
	userId: { _id: Types.ObjectId; name: string; profileImage?: string };
	review: string;
	likes: { userId: Types.ObjectId }[];
	date: Date;
}

export async function GET(req: NextRequest) {
	await connectMongoDB();

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "10", 10);
	const skip = (page - 1) * limit;

	const raw = await Review.find()
		.sort({ date: -1 })
		.skip(skip)
		.limit(limit)
		.populate("userId", "name profileImage")
		.lean<RawReview[]>();

	const reviews = raw.map((r) => {
		const populatedUser = {
			_id: r.userId?._id.toString(),
			name: r.userId?.name,
			profileImage: r.userId?.profileImage,
		};

		return {
			_id: r._id.toString(),
			userId: populatedUser._id,
			user: {
				name: populatedUser.name,
				profileImage: populatedUser.profileImage,
			},
			review: r.review,
			likes: (r.likes || []).map((l: { userId: Types.ObjectId }) => {
				const oid = l.userId != null ? l.userId : l;
				return { _id: oid.toString() };
			}),
			date: r.date,
		};
	});

	const hasMore = reviews.length === limit;
	return NextResponse.json({ reviews, hasMore });
}
