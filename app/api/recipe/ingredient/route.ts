import { connectMongoDB } from "@/app/lib/mongodb";
import { Ingredient } from "@/app/models/ingredient.model";
import { NextResponse } from "next/server";

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
		await connectMongoDB();

		const ingredients = await Ingredient.find({}, "_id name").lean();

		return NextResponse.json({ ingredients: ingredients });
	} catch (error) {
		console.error("Error fetching ingredients:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
