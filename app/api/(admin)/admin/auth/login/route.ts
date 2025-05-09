import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user.model";
import { comparePassword } from "@/app/lib/password";

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

	let usernameEmail = data.usernameEmail?.toString().trim() as string;
	const password = data.password as string;

	if (usernameEmail.includes("@")) {
		usernameEmail = usernameEmail.toLowerCase();
	}

	const userExists = await getUserByUsernameOrEmailDB(usernameEmail);

	const userAuthorized =
		userExists && comparePassword(password, userExists.password);

	if (userAuthorized) {
		console.log("User authorized");
		return Response.json(
			{
				_id: userExists._id,
				name: userExists.name,
				username: userExists.username,
				profileImage: userExists.profileImage,
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
