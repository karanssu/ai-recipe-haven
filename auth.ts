import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { encodePassword } from "@/app/utils/password";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { createSession } from "./app/lib/session";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === "google") {
				const googleId = profile?.sub as string | "google";
				const name = profile?.name as string | "";
				const username =
					name.replace(/\s/g, "").toLowerCase() + googleId.slice(0, 6);
				const email = profile?.email as string;
				const profileImage = profile?.picture as string | "";
				const hashPassowrd = encodePassword(googleId);

				let user = await getUserByUsernameOrEmailDB(email);

				if (!user) {
					try {
						user = await new User({
							name: name,
							username: username,
							email: email,
							password: hashPassowrd,
							profileImage: profileImage,
							role: "user",
						}).save();
					} catch (error) {
						console.log("Failed to create user with Google", error);
						return false;
					}
				}

				await createSession(user._id, user.role);
			}
			return true;
		},
		async session({ session, user }) {
			await createSession(user.id, "user");
			session.user.id = user.id;
			return session;
		},
	},
});

async function getUserByUsernameOrEmailDB(usernameEmail: string) {
	await connectMongoDB();

	const userExists = await User.findOne({
		$or: [{ username: usernameEmail }, { email: usernameEmail }],
	});
	return userExists;
}
