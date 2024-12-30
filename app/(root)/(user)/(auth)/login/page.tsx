import LoginForm from "@/app/components/(user)/(auth)/LoginForm";
import { signIn } from "@/auth";
import Form from "next/form";
import Link from "next/link";

const Page = () => {
	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold font-title">
				Log in
			</div>

			<div className="mt-5">
				<LoginForm />
			</div>

			<hr className="mt-5" />

			<div className="mt-5">
				<Form
					action={async () => {
						"use server";

						await signIn("google");
					}}
				>
					<button type="submit" className="py-2 px-4 w-full">
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
