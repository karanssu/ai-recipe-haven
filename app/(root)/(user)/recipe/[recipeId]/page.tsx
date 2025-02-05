import { verifySession } from "@/app/lib/dal";
import { Recipe, RecipeReview, SessionUser } from "@/app/lib/definitions";
import { calculateRecipeRating } from "@/app/lib/recipeUtils";

const getRecipe = async (recipeId: string): Promise<Recipe> => {
	const recipe: Recipe = {
		_id: recipeId,
		image:
			"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		tags: ["Indian", "Spicy", "Vegan"],
		userId: "1",
		name: "Tofu Tava Masala with Roti and Salad",
		ratings: [
			{ _id: "1", userId: "1", rating: 5 },
			{ _id: "2", userId: "2", rating: 4 },
			{ _id: "3", userId: "3", rating: 1 },
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
		ingredients: [
			{ _id: "1", name: "Tofu", quantity: 200, unit: "g" },
			{ _id: "2", name: "Tomato", quantity: 2, unit: "" },
			{ _id: "3", name: "Onion", quantity: 1, unit: "" },
			{ _id: "4", name: "Capsicum", quantity: 1, unit: "" },
		],
		cookingSteps: [
			{ number: 1, step: "Cut tofu into small cubes." },
			{ number: 2, step: "Cut tomato, onion, and capsicum." },
			{ number: 3, step: "Heat oil in a pan." },
			{
				number: 4,
				step: "Add tofu and cook until golden brown.",
			},
			{ number: 5, step: "Add tomato, onion, and capsicum." },
			{
				number: 6,
				step: "Add salt, red chili powder, and turmeric powder.",
			},
			{ number: 7, step: "Cook for 5 minutes." },
			{ number: 8, step: "Serve hot with roti and salad." },
		],
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
		<div>
			<div>Recipe: {recipe._id}</div>
			<div>Name: {recipe.name}</div>
			<div>Description: {recipe.description}</div>
			<div>Rating: {calculateRecipeRating(recipe.ratings)}</div>
			<div>Total Rating: {recipe.ratings?.length || 0}</div>
			<div>RecipeImg: {recipe.image}</div>
			<div>Total: {recipe.preparationMinutes + recipe.cookingMinutes} min</div>
			<div>Preparation Time: {recipe.preparationMinutes || 0} min</div>
			<div>Cooking Time: {recipe.cookingMinutes} min</div>
			<div>Serving: {recipe.serving}</div>
			<div>Per Serving: </div>
			<div>Calories: {recipe.calories}</div>
			<div>Fat: {recipe.fatGrams}g </div>
			<div>Carbs: {recipe.carbsGrams}g </div>
			<div>Fiber: {recipe.fiberGrams}g </div>
			<div>Sugar: {recipe.sugarGrams}g </div>
			<div>Protein: {recipe.proteinGrams}g</div>
			<div>Tags:</div>
			<div>
				{recipe.tags?.map((tag) => (
					<span key={tag} className="ml-2">
						{tag}
					</span>
				))}
			</div>
			<div>Ingredients:</div>
			<div>
				{recipe.ingredients?.map((ingredient) => (
					<span key={ingredient._id} className="ml-2">
						{ingredient.name}: {ingredient.quantity} {ingredient.unit}
					</span>
				))}
			</div>
			<div>
				Cooking Steps:
				{recipe.cookingSteps?.map((step) => (
					<div key={step.number} className="ml-2">
						{step.number}. {step.step}
					</div>
				))}
			</div>
			<div>Review: {recipeReviews?.length || 0}</div>
			<div>Rating: {calculateRecipeRating(recipe.ratings)}</div>
			<div>Current User Img: {user?.profileImage}</div>
			<div>Reviews:</div>
			{recipeReviews?.map((review) => (
				<div key={review._id} className="ml-2">
					<div>Review Date: {review.date.toDateString()}</div>
					<div>Review: {review.review}</div>
					<div>Likes: {review.likes.length}</div>
				</div>
			))}
		</div>
	);
};

export default Page;
