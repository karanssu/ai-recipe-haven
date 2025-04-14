import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { Recipe } from "@/app/models/recipe.model";

export async function GET(req: Request) {
	try {
		// only Frontend can access this route
		const referer = req.headers.get("referer");

		if (
			!referer ||
			!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
		) {
			return Response.json({ error: "Unauthorized" }, { status: 403 });
		}

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
