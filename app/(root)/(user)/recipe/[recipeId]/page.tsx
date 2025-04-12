import RatingSection from "@/app/components/(user)/RatingSection";
import ReviewSection from "@/app/components/(user)/ReviewSection";
import { verifySession } from "@/app/lib/dal";
import { Recipe, SessionUser } from "@/app/lib/definitions";
import {
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
					<div className="text-gray-600 mt-4">
						{RecipeDescription(recipe.description || "")}
					</div>
					<div className="mt-4">
						{user && (
							<RatingSection recipeId={recipeId} user={user} recipe={recipe} />
						)}
					</div>
					<div className="mt-4 space-y-1">
						<div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
							<h3 className="text-lg font-bold text-gray-800 mb-3">
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
					<div className="mt-4">
						<div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
							<h3 className="text-lg font-bold text-gray-800 mb-3">
								Nutrition
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-sm text-gray-700">
									<span className="font-medium">Calories:</span>{" "}
									{recipe.calories}
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Fat:</span> {recipe.fatGrams}g
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Carbs:</span>{" "}
									{recipe.carbsGrams}g
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Fiber:</span>{" "}
									{recipe.fiberGrams}g
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Sugar:</span>{" "}
									{recipe.sugarGrams}g
								</div>
								<div className="text-sm text-gray-700">
									<span className="font-medium">Protein:</span>{" "}
									{recipe.proteinGrams}g
								</div>
							</div>
						</div>
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

			<ReviewSection recipeId={recipeId} user={user} />
		</div>
	);
};

export default Page;
