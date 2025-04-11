import { verifySession } from "@/app/lib/dal";
import { Recipe, RecipeReview, SessionUser } from "@/app/lib/definitions";
import {
	calculateRecipeRating,
	getDisplayTimeWithUnit,
	parseHTMLTextToHtml,
} from "@/app/lib/recipeUtils";
import Image from "next/image";

const getRecipe = async (recipeId: string): Promise<Recipe> => {
	"use server";

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}`,
		{
			method: "GET",
			referrer: process.env.NEXT_PUBLIC_APP_URL,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const data = await res.json();
	const recipe: Recipe = data?.recipe || {};

	return recipe;
};

const RecipeDescription = (text: string) => {
	return (
		<div dangerouslySetInnerHTML={{ __html: parseHTMLTextToHtml(text) }} />
	);
};

const getRecipeReviews = async (recipeId: string): Promise<RecipeReview[]> => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/review`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	const data = await res.json();
	return data.reviews || [];
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
				<div className="relative w-full md:w-1/2 h-96 md:h-auto max-h-screen">
					<Image
						src={recipe.imageUrl}
						alt={recipe.name}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
					/>
				</div>
				<div className="w-full md:w-1/2 p-6">
					<h1 className="text-4xl font-bold text-gray-800">{recipe.name}</h1>
					<p className="text-gray-600 mt-4">
						{RecipeDescription(recipe.description || "")}
					</p>
					<div className="mt-4 flex items-center space-x-4">
						<div className="text-primaryBgHover font-semibold">
							Rating: {calculateRecipeRating(recipe.ratings)}
						</div>
						<div className="text-gray-500">({recipe.ratings?.length || 0})</div>
					</div>
					<div className="mt-4 space-y-1 text-gray-700">
						<div>
							<span className="font-medium">Total Time: </span>
							{getDisplayTimeWithUnit(
								recipe.preparationMinutes + recipe.cookingMinutes
							)}
						</div>
						<div>
							<span className="font-medium">Preparation: </span>
							{getDisplayTimeWithUnit(recipe.preparationMinutes)}
						</div>
						<div>
							<span className="font-medium">Cooking: </span>
							{getDisplayTimeWithUnit(recipe.cookingMinutes)}
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
							<div className="flex flex-wrap mt-1">
								{recipe.tags.map((tag) => (
									<span
										key={tag}
										className="mr-2 mb-2 px-3 py-1 bg-primaryBg text-primaryText text-sm font-menu font-semibold"
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
						{recipe.ingredients?.map((ingredient) => (
							<li key={ingredient.name}>
								{ingredient.name}: {ingredient.quantity} {ingredient.unit}
							</li>
						))}
					</ul>
				</div>
				{/* Cooking Steps */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Cooking Steps
					</h2>
					<ol className="list-decimal list-inside text-gray-700 space-y-3">
						{recipe.cookingSteps?.map((step) => (
							<li key={step.number} className="list-none">
								<span className="font-medium">{step.number}.</span> {step.step}
							</li>
						))}
					</ol>
				</div>
			</div>

			{user && (
				<form
					action={async (formData: FormData) => {
						"use server";
						await fetch(
							`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/review`,
							{
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									userId: user._id,
									review: formData.get("review")?.toString(),
									date: new Date(),
								}),
							}
						);
					}}
					className="mb-6 space-y-4"
				>
					<textarea
						name="review"
						required
						rows={3}
						placeholder="Write your review..."
						className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:border-primaryBg"
					/>
					<button
						type="submit"
						className="px-6 py-2 bg-primaryBg text-white font-semibold rounded-md hover:bg-primaryBgHover transition"
					>
						Submit Review
					</button>
				</form>
			)}

			{/* Reviews Section */}
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Reviews ({recipeReviews?.length || 0})
				</h2>
				{recipeReviews?.map((review) => (
					<div key={review._id} className="border-t border-gray-200 py-4">
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 rounded-full overflow-hidden">
								{review.user?.profileImage ? (
									<Image
										src={review.user.profileImage}
										alt={review.user.name || "User"}
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
									{review.user?.name || "Anonymous"}
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
