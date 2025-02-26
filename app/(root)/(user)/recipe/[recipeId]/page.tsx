import { verifySession } from "@/app/lib/dal";
import { Recipe, RecipeReview, SessionUser } from "@/app/lib/definitions";
import { calculateRecipeRating } from "@/app/lib/recipeUtils";
import Image from "next/image";

const getRecipe = async (recipeId: string): Promise<Recipe> => {
	const recipe: Recipe = {
		_id: recipeId,
		apiId: "1",
		imageUrl:
			"https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg",
		tags: ["Indian", "Spicy", "Vegan"],
		name: "Tofu Tava Masala with Roti and Salad",
		ratings: [
			{ userId: "1", rating: 5 },
			{ userId: "2", rating: 4 },
			{ userId: "3", rating: 1 },
		],
		serving: 4,
		calories: 200,
		fatGrams: 10,
		carbsGrams: 20,
		fiberGrams: 5,
		sugarGrams: 5,
		proteinGrams: 15,
		preparationMinutes: 15,
		cookingMinutes: 30,
		description:
			"This is a very good recipe. I loved it. I tried this recipe and it was amazing.",
		// ingredients: [
		// 	{ _id: "1", name: "Tofu", quantity: 200, unit: "g" },
		// 	{ _id: "2", name: "Tomato", quantity: 2, unit: "" },
		// 	{ _id: "3", name: "Onion", quantity: 1, unit: "" },
		// 	{ _id: "4", name: "Capsicum", quantity: 1, unit: "" },
		// ],
		// cookingSteps: [
		// 	{ number: 1, step: "Cut tofu into small cubes." },
		// 	{ number: 2, step: "Cut tomato, onion, and capsicum." },
		// 	{ number: 3, step: "Heat oil in a pan." },
		// 	{
		// 		number: 4,
		// 		step: "Add tofu and cook until golden brown.",
		// 	},
		// 	{ number: 5, step: "Add tomato, onion, and capsicum." },
		// 	{
		// 		number: 6,
		// 		step: "Add salt, red chili powder, and turmeric powder.",
		// 	},
		// 	{ number: 7, step: "Cook for 5 minutes." },
		// 	{ number: 8, step: "Serve hot with roti and salad." },
		// ],
	};

	return recipe;
};

const getRecipeReviews = async (recipeId: string): Promise<RecipeReview[]> => {
	const recipeReviews: RecipeReview[] = [
		{
			_id: recipeId + "1",
			userId: "1",
			review: "This is a very good recipe. I loved it.",
			likes: [{ _id: "1", userId: "2" }],
			date: new Date(),
		},
		{
			_id: "2",
			userId: "2",
			review: "I tried this recipe and it was amazing!!!",
			likes: [],
			date: new Date(),
		},
	];

	return recipeReviews;
};

const Page = async ({ params }: { params: Promise<{ recipeId: string }> }) => {
	const session = await verifySession();
	let user: SessionUser | null = null;
	if (session) user = { ...session, _id: session.userId };

	const recipeId = (await params).recipeId;
	const recipe = await getRecipe(recipeId);
	const recipeReviews = await getRecipeReviews(recipeId);

	return (
		<div className="container mx-auto px-4 py-8 space-y-12">
			{/* Recipe Header */}
			<div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="relative w-full md:w-1/2 h-64 md:h-auto">
					<Image
						src={recipe.imageUrl}
						alt={recipe.name}
						layout="fill"
						objectFit="cover"
						className="rounded-l-lg"
					/>
				</div>
				<div className="w-full md:w-1/2 p-6">
					<h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
					<p className="text-gray-600 mt-4">{recipe.description}</p>
					<div className="mt-4 flex items-center space-x-4">
						<div className="text-primaryBgHover font-semibold">
							Rating: {calculateRecipeRating(recipe.ratings)}
						</div>
						<div className="text-gray-500">
							{/* ({recipe.ratings?.length || 0} reviews) */}
						</div>
					</div>
					<div className="mt-4 space-y-1 text-gray-700">
						<div>
							<span className="font-medium">Total Time:</span>{" "}
							{recipe.preparationMinutes + recipe.cookingMinutes} min
						</div>
						<div>
							<span className="font-medium">Preparation:</span>{" "}
							{recipe.preparationMinutes} min
						</div>
						<div>
							<span className="font-medium">Cooking:</span>{" "}
							{recipe.cookingMinutes} min
						</div>
						<div>
							<span className="font-medium">Serving:</span> {recipe.serving}
						</div>
					</div>
					<div className="mt-4 text-gray-700">
						<span className="font-medium">Nutrition:</span> {recipe.calories}{" "}
						Calories, {recipe.fatGrams}g Fat, {recipe.carbsGrams}g Carbs,{" "}
						{recipe.fiberGrams}g Fiber, {recipe.sugarGrams}g Sugar,{" "}
						{recipe.proteinGrams}g Protein
					</div>
					{recipe.tags && (
						<div className="mt-4">
							<span className="font-medium text-gray-700">Tags:</span>
							<div className="flex flex-wrap mt-1">
								{recipe.tags.map((tag) => (
									<span
										key={tag}
										className="mr-2 mb-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Ingredients & Cooking Steps */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Ingredients */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
					<ul className="list-disc list-inside text-gray-700 space-y-2">
						{/* {recipe.ingredients?.map((ingredient) => (
							<li key={ingredient._id}>
								{ingredient.name}: {ingredient.quantity} {ingredient.unit}
							</li>
						))} */}
					</ul>
				</div>
				{/* Cooking Steps */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Cooking Steps
					</h2>
					<ol className="list-decimal list-inside text-gray-700 space-y-3">
						{/* {recipe.cookingSteps?.map((step) => (
							<li key={step.number} className="list-none">
								<span className="font-medium">{step.number}.</span> {step.step}
							</li>
						))} */}
					</ol>
				</div>
			</div>

			{/* Reviews Section */}
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Reviews ({recipeReviews?.length || 0})
				</h2>
				{recipeReviews?.map((review) => (
					<div key={review._id} className="border-t border-gray-200 py-4">
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 rounded-full overflow-hidden">
								{user?.profileImage ? (
									<Image
										src={user.profileImage}
										alt={user.name || "User"}
										width={40}
										height={40}
										className="object-cover"
									/>
								) : (
									<div className="bg-gray-300 w-full h-full" />
								)}
							</div>
							<div>
								<p className="text-gray-800 font-semibold">
									{user?.name || "Anonymous"}
								</p>
								<p className="text-gray-500 text-sm">
									{new Date(review.date).toLocaleDateString()}
								</p>
							</div>
						</div>
						<p className="text-gray-700 mt-2">{review.review}</p>
						<div className="text-gray-500 text-sm mt-2">
							Likes: {review.likes.length}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Page;
