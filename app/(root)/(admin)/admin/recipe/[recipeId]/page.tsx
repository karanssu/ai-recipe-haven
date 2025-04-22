import RatingSection from "@/app/components/(user)/RatingSection";
import ReviewSection from "@/app/components/(user)/ReviewSection";
import { verifySession } from "@/app/lib/dal";
import { Recipe, SessionUser } from "@/app/lib/definitions";
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

const Page = async ({ params }: { params: Promise<{ recipeId: string }> }) => {
	const session = await verifySession();
	let user: SessionUser | null = null;
	if (session) user = { ...session, _id: session.userId };

	const recipeId = (await params).recipeId;
	const recipe = await getRecipe(recipeId);

	return (
		<div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
			{/* Recipe Header */}
			<div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden">
				<div className="group relative w-full md:w-1/2 h-96 md:h-[450px] max-h-screen overflow-hidden">
					<Image
						src={
							recipe.imageUrl && recipe.imageUrl !== ""
								? recipe.imageUrl
								: "/default-recipe-image.jpg"
						}
						alt={recipe.name}
						priority
						fill
						sizes="(max-width: 767px) 100vw, 50vw"
						className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
					/>
				</div>
				<div className="w-full md:w-1/2 p-8">
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						{recipe.name}
					</h1>
					<div className="mt-4 text-base text-gray-600">
						{RecipeDescription(recipe.description || "")}
					</div>
					<div className="mt-4">
						{user ? (
							<RatingSection recipeId={recipeId} user={user} recipe={recipe} />
						) : (
							<div className="mt-4 flex items-center space-x-4">
								<div className="text-primaryBgHover font-semibold text-lg transition-colors duration-200">
									Rating: {calculateRecipeRating(recipe.ratings)}
								</div>
								<div className="text-gray-500 text-sm">
									({recipe.ratings?.length || 0})
								</div>
							</div>
						)}
					</div>
					<div className="mt-4 space-y-1">
						<div className="mt-6 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-md">
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Recipe Info
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-sm text-gray-700">
									<span className="font-medium">Total Time:</span>
									<span className="ml-1">
										{getDisplayTimeWithUnit(
											recipe.preparationMinutes + recipe.cookingMinutes
										)}
									</span>
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Preparation:</span>
									<span className="ml-1">
										{getDisplayTimeWithUnit(recipe.preparationMinutes)}
									</span>
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Cooking:</span>
									<span className="ml-1">
										{getDisplayTimeWithUnit(recipe.cookingMinutes)}
									</span>
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Serving:</span>
									<span className="ml-1">{recipe.serving}</span>
								</div>
							</div>
						</div>
					</div>
					{[
						recipe.calories,
						recipe.fatGrams,
						recipe.carbsGrams,
						recipe.fiberGrams,
						recipe.sugarGrams,
						recipe.proteinGrams,
					].some((v) => v != null) && (
						<div className="mt-4">
							<div className="mt-6 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-md">
								<h3 className="text-lg font-bold text-gray-900 mb-3">
									Nutrition
								</h3>
								<div className="grid grid-cols-2 gap-4">
									{recipe.calories != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Calories:</span>{" "}
											{recipe.calories}
										</div>
									)}
									{recipe.fatGrams != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Fat:</span>{" "}
											{recipe.fatGrams}g
										</div>
									)}
									{recipe.carbsGrams != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Carbs:</span>{" "}
											{recipe.carbsGrams}g
										</div>
									)}
									{recipe.fiberGrams != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Fiber:</span>{" "}
											{recipe.fiberGrams}g
										</div>
									)}
									{recipe.sugarGrams != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Sugar:</span>{" "}
											{recipe.sugarGrams}g
										</div>
									)}
									{recipe.proteinGrams != null && (
										<div className="text-sm text-gray-700">
											<span className="font-medium">Protein:</span>{" "}
											{recipe.proteinGrams}g
										</div>
									)}
								</div>
							</div>
						</div>
					)}
					{recipe.tags && (
						<div className="mt-8">
							<div className="flex flex-wrap mt-1">
								{recipe.tags.map((tag) => (
									<span
										key={tag}
										className="mr-3 mb-4 px-3 py-1 bg-primaryBg text-primaryText text-sm font-menu rounded-lg font-semibold"
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
				<div className="bg-white p-8 rounded-xl shadow-xl">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
					<ul className="list-disc list-inside text-gray-700 space-y-2">
						{recipe.ingredients?.map((ingredient) => (
							<li key={ingredient.name}>
								{ingredient.name}: {ingredient.quantity} {ingredient.unit}
							</li>
						))}
					</ul>
				</div>
				{/* Cooking Steps */}
				<div className="bg-white p-8 rounded-xl shadow-xl">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
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

			<ReviewSection recipeId={recipeId} user={user} />
		</div>
	);
};

export default Page;
