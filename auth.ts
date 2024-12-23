import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "@/utils/password";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/models/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google,
		Credentials({
			credentials: {
				usernameEmail: {},
				password: {},
			},
			authorize: async (credentials) => {
				let user = null;

				const usernameEmail = credentials.usernameEmail
					?.toString()
					.trim() as string;
				const password = credentials.password as string;

				await connectMongoDB();

				const userExists = await User.findOne({
					$or: [{ username: usernameEmail }, { email: usernameEmail }],
				});

				const userAuthorized =
					userExists && comparePassword(password, userExists.password);

				if (userAuthorized) {
					console.log("User authorized", userAuthorized);
					user = userExists;
				} else {
					console.log("User not authorized", userAuthorized);
				}

				return user;
			},
		}),
	],
});
