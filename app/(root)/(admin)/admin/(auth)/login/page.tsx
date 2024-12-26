import AdminLoginForm from "@/app/components/admin-login-form";

const Page = () => {
	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[400px] ml-auto mr-auto mt-10">
			<div className="text-4xl text-center font-semibold">Admin Login</div>

			<div className="mt-5">
				<AdminLoginForm />
			</div>
		</div>
	);
};

export default Page;
