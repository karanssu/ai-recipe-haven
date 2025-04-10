import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe } from "@/app/models/recipe.model";

export async function GET() {
	try {
		await connectMongoDB();
		const allTagsDocs = await Recipe.find({}, "tags");
		const allTags = allTagsDocs.flatMap((doc) => doc.tags || []);
		const uniqueTags = [...new Set(allTags)];
		return NextResponse.json({ tags: uniqueTags });
	} catch (error) {
		console.error("Error fetching tags:", error);
		return NextResponse.json(
			{ error: "Failed to fetch tags" },
			{ status: 500 }
		);
	}
}
