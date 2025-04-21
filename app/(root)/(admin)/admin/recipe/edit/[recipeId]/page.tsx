const Page = async ({ params }: { params: Promise<{ recipeId: string }> }) => {
	const recipeId = (await params).recipeId;

	return <div>Admin Edit Recipe Page: {recipeId}</div>;
};

export default Page;
