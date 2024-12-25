import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { encodePassword } from "@/app/utils/password";

export async function POST(req: Request) {
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
			role: "admin",
		});

		if (!user) {
			return Response.json(
				{
					errors: { error: "An error occurred while creating admin account." },
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
				errors: { error: "An error occurred while creating admin account." },
			},
			{ status: 500 }
		);
	}
}
