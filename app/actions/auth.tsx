import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import { encodePassword } from "../utils/password";
import { connectMongoDB } from "../lib/mongodb";
import User from "@/app/models/user";

export async function signup(state: FormState, formData: FormData) {
	const validatedFields = SignupFormSchema.safeParse({
		name: formData.get("name"),
		username: formData.get("username"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const name = validatedFields.data.name.trim();
	const username = validatedFields.data.username.trim();
	const email = validatedFields.data.email.trim();
	const password = validatedFields.data.password;
	const hashedPassword = encodePassword(password);

	console.log(name, username, email, password, hashedPassword);

	try {
		await connectMongoDB();

		// const usernameEmailExist = await User.findOne({
		// 	$or: [{ username }, { email }],
		// }).select(["_id", "username", "email"]);

		// if (usernameEmailExist) {
		// 	if (usernameEmailExist.username === username)
		// 		console.log("Username already exists");
		// 	if (usernameEmailExist.email === email)
		// 		console.log("Email already exists");
		// 	return;
		// }

		// const user = await User.create({
		// 	name,
		// 	username,
		// 	email,
		// 	password: hashedPassword,
		// });

		// if (!user) {
		// 	return {
		// 		message: "An error occurred while creating your account.",
		// 	};
		// }

		// await createSession(user._id, "user");

		redirect("/login");
	} catch (error) {
		return {
			message: "An error occurred while creating your account." + error,
		};
	}
}
