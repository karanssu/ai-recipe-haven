import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { comparePassword } from "@/app/utils/password";

export async function POST(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const data = await req.json();

	const usernameEmail = data.usernameEmail?.toString().trim() as string;
	const password = data.password as string;

	const userExists = await getUserByUsernameOrEmailDB(usernameEmail);

	const userAuthorized =
		userExists && comparePassword(password, userExists.password);

	if (userAuthorized) {
		console.log("User authorized");
		return Response.json(
			{
				_id: userExists._id,
				role: userExists.role,
			},
			{ status: 200 }
		);
	} else {
		return Response.json(
			{
				error: "Invalid admin credentials",
			},
			{ status: 401 }
		);
	}
}

async function getUserByUsernameOrEmailDB(usernameEmail: string) {
	await connectMongoDB();

	const user = await User.findOne({
		$or: [{ username: usernameEmail }, { email: usernameEmail }],
		role: { $in: ["admin", "superadmin"] },
	});

	return user;
}
