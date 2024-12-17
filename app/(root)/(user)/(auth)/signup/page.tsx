import Form from "next/form";

const Page = () => {
	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold">Sign up</div>
			<div className="flex justify-center mt-10">
				<Form
					action={async () => {
						"use server";
						console.log("Sign up with Google");
					}}
				>
					<button
						type="submit"
						className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
					>
						Log in with Google
					</button>
				</Form>
			</div>
		</>
	);
};

export default Page;
