import { signIn } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { encodePassword } from "@/utils/password";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = () => {
	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold">Sign up</div>

			<div className="mt-5">
				<Form
					action={async (formData: FormData) => {
						"use server";

						const name = formData.get("name") as string;
						const username = formData.get("username") as string;
						const email = formData.get("email") as string;
						const password = formData.get("password") as string;
						const hashPassword = encodePassword(password);

						await connectMongoDB();

						const usernameEmailExists = await User.findOne({
							$or: [{ username }, { email }],
						}).select(["_id", "username", "email"]);

						if (usernameEmailExists) {
							if (usernameEmailExists.username === username)
								console.log("Username already exists");
							if (usernameEmailExists.email === email)
								console.log("Email already exists");
							return;
						}

						await User.create({
							name,
							username,
							email,
							password: hashPassword,
						});

						redirect("/login");
					}}
				>
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<input
						type="text"
						name="username"
						placeholder="Username"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<button
						type="submit"
						className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
					>
						Sign up
					</button>
				</Form>
			</div>

			<hr className="mt-5" />

			<div className="mt-5">
				<Form
					action={async () => {
						"use server";

						await signIn("google");
					}}
				>
					<button
						type="submit"
						className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 w-full rounded"
					>
						Log in with Google
					</button>
				</Form>
			</div>

			<div className="text-center mt-5">
				<span>Already have an Account?</span>
				<Link className="ml-2 text-blue-500" href="/login">
					Log in
				</Link>
			</div>
		</div>
	);
};

export default Page;
