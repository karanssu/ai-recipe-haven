import EditUserProfileForm from "@/app/components/(user)/EditUserProfileForm";
import { verifySession } from "@/app/lib/dal";
import { User as UserDef } from "@/app/lib/definitions";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";

const Page = async () => {
	const session = await verifySession();

	if (!session) return null;

	const userId = session.userId;
	const user: UserDef = await getUserById(userId);

	const saveUser = async () => {
		"use server";

		console.log("User Profile Updated");
	};

	return (
		<div className="border-2 border-gray-200 p-5 rounded-lg w-[500px] ml-auto mr-auto mt-10">
			<EditUserProfileForm user={user} revalidatePageAction={saveUser} />
		</div>
	);
};

async function getUserById(userId: string) {
	await connectMongoDB();

	const user = await User.findById(userId);
	return user;
}

export default Page;
