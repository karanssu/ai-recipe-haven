import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextApiRequest } from "next";

export async function DELETE(req: NextApiRequest) {
	// only Frontend can access this route
	const referer = req.headers.referer;

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const { id } = req.query;

	try {
		await connectMongoDB();

		// delete user by id
		const user = await User.findByIdAndDelete(id);

		return Response.json(
			{ user: user, message: "User deleted successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return Response.json(
			{
				errors: { error: "An error occurred while deleting user." },
			},
			{ status: 500 }
		);
	}
}
