import Form from "next/form";

const Page = () => {
	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold">Admin Sign up</div>

			<div className="mt-5">
				<Form
					action={async () => {
						"use server";
						console.log("Sign up with email and password");
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
						className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5 mb-5"
					>
						Sign up
					</button>
				</Form>
			</div>
		</div>
	);
};

export default Page;
