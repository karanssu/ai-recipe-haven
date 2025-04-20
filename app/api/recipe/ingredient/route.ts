import { connectMongoDB } from "@/app/lib/mongodb";
import { Ingredient } from "@/app/models/ingredient.model";
import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {
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

		return res.status(200).json(ingredients);
	} catch (error) {
		console.error("Error fetching ingredients:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}
