import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { encodePassword } from "@/app/lib/password";

export async function PUT(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const { _id, name, username, email, password, profileImage } =
		await req.json();

	let hashedPassword = "";
	if (password) hashedPassword = encodePassword(password as string);

	try {
		await connectMongoDB();

		const usernameEmailExist = await User.findOne({
			$or: [{ username }, { email }],
			_id: { $ne: _id },
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

		let data = null;
		if (password) {
			data = { name, username, email, password: hashedPassword, profileImage };
		} else {
			data = { name, username, email, profileImage };
		}

		// update user by id
		const user = await User.findByIdAndUpdate(_id, data, { new: true });

		if (!user) {
			return Response.json(
				{
					errors: { error: "An error occurred while updating user account." },
				},
				{ status: 500 }
			);
		}

		return Response.json(
			{ user: user, message: "User updated successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return Response.json(
			{
				errors: { error: "An error occurred while updating your account." },
			},
			{ status: 500 }
		);
	}
}
