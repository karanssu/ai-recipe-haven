import { verifySession } from "@/app/lib/dal";

const Page = async () => {
	const session = await verifySession();
	if (!session) return null;

	const user = { ...session, _id: session.userId };

	// const recipes = await getUserRecipe(user?._id);

	return <div>My Recipes</div>;
};

export default Page;
