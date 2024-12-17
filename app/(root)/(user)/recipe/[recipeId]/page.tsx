const Page = async ({ params }: { params: Promise<{ recipeId: string }> }) => {
	const recipeId = (await params).recipeId;

	return (
		<div className="text-4xl text-center mt-10 font-semibold">
			Recipe: {recipeId}
		</div>
	);
};

export default Page;
