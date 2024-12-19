import { auth, signIn } from "@/auth";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
	const session = await auth();

	if (session && session?.user) {
		redirect("/dashboard");
	}

	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold">Log in</div>

			<div className="mt-5">
				<Form
					action={async () => {
						"use server";
						console.log("Sign up with email and password");
					}}
				>
					<input
						type="text"
						name="usernameEmail"
						placeholder="Email or username"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					/>
					<button
						type="submit"
						className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
					>
						Log in
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
				<span>Don&#39;t have an account?</span>
				<Link className="ml-2 text-blue-500" href="/signup">
					Sign up
				</Link>
			</div>
		</div>
	);
};

export default Page;
