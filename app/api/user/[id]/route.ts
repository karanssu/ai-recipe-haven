import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user.model";

export async function DELETE(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const url = new URL(req.url);
	const id = url.pathname.split("/").pop();

	try {
		await connectMongoDB();

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
