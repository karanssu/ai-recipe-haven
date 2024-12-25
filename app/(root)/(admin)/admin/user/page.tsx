import UserTable from "@/app/ui/userTable";
import React from "react";

const Page = () => {
	const users = [
		{
			_id: 1,
			name: "John Doe",
			username: "john_doe",
			email: "jogndoe@mgail.com",
			password: "password",
			profileImage: "https://randomuserlink.com",
			role: "user",
		},
		{
			_id: 2,
			name: "Maria",
			username: "maria_123",
			email: "maria@mgail.com",
			password: "password",
			profileImage: "https://randomuserlink.com",
			role: "user",
		},
		{
			_id: 3,
			name: "Bruse Wayne",
			username: "bruse_wayne",
			email: "bruse@mgail.com",
			password: "password",
			profileImage: "https://randomuserlink.com",
			role: "user",
		},
	];

	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold">
				Manage Users
			</div>
			<div className="m-10">
				<UserTable users={users} />
			</div>
		</>
	);
};

export default Page;
