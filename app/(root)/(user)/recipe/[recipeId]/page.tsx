import { verifySession } from "@/app/lib/dal";
import { Recipe, SessionUser } from "@/app/lib/definitions";
import { calculateRecipeRating } from "@/app/lib/recipe";

const getRecipe = async (recipeId: string): Promise<Recipe> => {
	const recipe: Recipe = {
		_id: recipeId,
		image:
			"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		tags: ["Indian", "Spicy", "Vegan"],
		user: {
			_id: "1",
			name: "Karan Patel",
			username: "karandpatel321",
			profileImage:
				"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		},
		name: "Tofu Tava Masala with Roti and Salad",
		ratings: [
			{ _id: "1", userId: "1", rating: 5 },
			{ _id: "2", userId: "2", rating: 4 },
			{ _id: "3", userId: "3", rating: 1 },
		],
		reviews: [
			{
				_id: "1",
				user: {
					userId: "1",
					username: "john_doe",
					profileImage:
						"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
				},
				review: "This is a very good recipe. I loved it.",
				likes: [{ _id: "1", userId: "2" }],
				date: new Date(),
				rating: 5,
				comments: [
					{
						_id: "1",
						userId: "2",
						comment: "I loved it too.",
						date: new Date(),
					},
					{
						_id: "1",
						userId: "3",
						comment: "I loved it, it's amazing.",
						date: new Date(),
					},
				],
			},
			{
				_id: "2",
				user: {
					userId: "2",
					username: "merry",
				},
				review: "I tried this recipe and it was amazing.",
				likes: [],
				date: new Date(),
				rating: 4,
			},
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
			{ _id: "1", number: 1, description: "Cut tofu into small cubes." },
			{ _id: "2", number: 2, description: "Cut tomato, onion, and capsicum." },
			{ _id: "3", number: 3, description: "Heat oil in a pan." },
			{
				_id: "4",
				number: 4,
				description: "Add tofu and cook until golden brown.",
			},
			{ _id: "5", number: 5, description: "Add tomato, onion, and capsicum." },
			{
				_id: "6",
				number: 6,
				description: "Add salt, red chili powder, and turmeric powder.",
			},
			{ _id: "7", number: 7, description: "Cook for 5 minutes." },
			{ _id: "8", number: 8, description: "Serve hot with roti and salad." },
		],
	};

	return recipe;
};

const Page = async ({ params }: { params: Promise<{ recipeId: string }> }) => {
	const session = await verifySession();
	let user: SessionUser | null = null;
	if (session) user = { ...session, _id: session.userId };

	const recipeId = (await params).recipeId;
	const recipe = await getRecipe(recipeId);

	return (
		<div>
			<div>Recipe: {recipe._id}</div>
			<div>Name: {recipe.name}</div>
			<div>Description: {recipe.description}</div>
			<div>userImg: {recipe.user.profileImage}</div>
			<div>user Name: {recipe.user.name}</div>
			<div>user username: {recipe.user.username}</div>
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
					<div key={step._id} className="ml-2">
						{step.number}. {step.description}
					</div>
				))}
			</div>
			<div>Review: {recipe.reviews?.length || 0}</div>
			<div>Rating: {calculateRecipeRating(recipe.ratings)}</div>
			<div>Current User Img: {user?.profileImage}</div>
			<div>Reviews:</div>
			{recipe.reviews?.map((review) => (
				<div key={review._id} className="ml-2">
					<div>Review User Img: {review.user.profileImage}</div>
					<div>Review User Username: {review.user.username}</div>
					<div>Review Date: {review.date.toDateString()}</div>
					<div>Rating: {review.rating}</div>
					<div>Review: {review.review}</div>
					<div>Likes: {review.likes.length}</div>

					{review.comments?.map((comment) => (
						<div key={comment._id} className="ml-2">
							Comment: {comment.comment}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Page;
