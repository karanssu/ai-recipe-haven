import AdminSignupForm from "@/app/components/(admin)/AdminSignupForm";

const Page = () => {
	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold font-title">
				Admin Signup
			</div>

			<div className="mt-5">
				<AdminSignupForm />
			</div>
		</div>
	);
};

export default Page;
