"use client";

import EditUserForm from "@/app/components/(admin)/EditUserForm";
import { User } from "@/app/lib/definitions";

const Page = () => {
	const user: User = {
		_id: 1,
		name: "Test",
		role: "admin",
		username: "test",
		password: "test",
		profileImage: "https://www.google.com",
		email: "test@gmail.com",
	};

	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[500px] ml-auto mr-auto mt-10">
			<EditUserForm
				title="Profile"
				user={user}
				revalidatePageAction={() => {
					console.log("user profile edited");
				}}
			/>
		</div>
	);
};

export default Page;
