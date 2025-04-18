import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user.model";
import { encodePassword } from "@/app/lib/password";

export async function POST(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const { name, username, email, password } = await req.json();
	const hashedPassword = encodePassword(password as string);

	try {
		await connectMongoDB();

		const usernameEmailExist = await User.findOne({
			$or: [{ username }, { email }],
		}).select(["_id", "username", "email"]);

		if (usernameEmailExist) {
			if (usernameEmailExist.username === username)
				return Response.json(
					{
						errors: { error: "Username already exists" },
					},
					{ status: 500 }
				);
			if (usernameEmailExist.email === email)
				return Response.json(
					{
						errors: { error: "Email already exists" },
					},
					{ status: 500 }
				);
			return;
		}

		const user = await User.create({
			name,
			username,
			email,
			password: hashedPassword,
		});

		if (!user) {
			return Response.json(
				{
					errors: { error: "An error occurred while creating your account." },
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{ message: "Account created successfully." },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return Response.json(
			{
				errors: { error: "An error occurred while creating your account." },
			},
			{ status: 500 }
		);
	}
}
