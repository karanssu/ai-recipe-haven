import { verifySession } from "@/app/lib/dal";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import UserTable from "@/app/components/(admin)/UserTable";
import { unstable_cache } from "next/cache";
import React from "react";

const getUsers = async () => {
	"use server";

	let users = [];
	let role = "admin";
	const session = await verifySession();
	if (session?.role === "superadmin") {
		role = "superadmin";
	}

	if (role === "admin") {
		users = await getUsersForAdmin();
	} else if (role === "superadmin") {
		users = await getUsersForSuperAdmin();
	}

	return users;
};

const getUsersForAdmin = unstable_cache(
	async () => {
		"use server";

		await connectMongoDB();

		const users = await User.find({ role: "user" }).exec();

		return users;
	},
	["usersForAdmin"],
	{ revalidate: 10, tags: ["usersForAdmin"] }
);

const getUsersForSuperAdmin = unstable_cache(
	async () => {
		"use server";

		await connectMongoDB();

		const users = await User.find({
			role: { $in: ["user", "admin"] },
		}).exec();

		return users;
	},
	["usersForSuperAdmin"],
	{ revalidate: 10, tags: ["usersForSuperAdmin"] }
);

const Page = async () => {
	const users = await getUsers();

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
