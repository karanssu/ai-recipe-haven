import { verifySession } from "@/app/lib/dal";
import { Recipe, SessionUser } from "@/app/lib/definitions";
import { calculateRecipeRating } from "@/app/lib/recipe";
import { redirect } from "next/navigation";

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
				userId: "1",
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
				userId: "2",
				review: "I tried this recipe and it was amazing.",
				likes: [],
				date: new Date(),
				rating: 4,
			},
		],
		level: "easy",
		people: 4,
		maxPeople: 6,
		calories: 200,
		fatGrams: 10,
		carbsGrams: 20,
		fiberGrams: 5,
		sugarGrams: 5,
		proteinGrams: 15,
		preparationTime: 15,
		cookingTime: 30,
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

	if (!session) redirect("/login");

	const user: SessionUser = { ...session, _id: session.userId };
	const recipeId = (await params).recipeId;
	const recipe = await getRecipe(recipeId);

	return (
		<div className="text-4xl text-center mt-10 font-semibold font-title">
			Recipe: {recipe._id}
			Name: {recipe.name}
			Description: {recipe.description}
			userImg: {recipe.user.profileImage}
			user Name: {recipe.user.name}
			user username: {recipe.user.username}
			Rating: {calculateRecipeRating(recipe.ratings)}
			Total Rating: {recipe.ratings?.length || 0}
			RecipeImg: {recipe.image}
			Level: {recipe.level}
			Total: {(recipe.preparationTime || 0) + recipe.cookingTime} min
			Preparation Time: {recipe.preparationTime || 0} min Cooking Time:{" "}
			{recipe.cookingTime} min Serving: {recipe.people} - {recipe.maxPeople}
			Per Serving: Calories: {recipe.calories}
			Fat: {recipe.fatGrams}g Carbs: {recipe.carbsGrams}g Fiber:{" "}
			{recipe.fiberGrams}g Sugar: {recipe.sugarGrams}g Protein:{" "}
			{recipe.proteinGrams}g Tags:
			{recipe.tags?.map((tag) => (
				<span key={tag} className="ml-2">
					{tag}
				</span>
			))}
			Ingredients:
			{recipe.ingredients?.map((ingredient) => (
				<div key={ingredient._id} className="ml-2">
					{ingredient.name}: {ingredient.quantity} {ingredient.unit}
				</div>
			))}
			Cooking Steps:
			{recipe.cookingSteps?.map((step) => (
				<div key={step._id} className="ml-2">
					{step.number}. {step.description}
				</div>
			))}
			Review: {recipe.reviews?.length || 0}
			Rating: {calculateRecipeRating(recipe.ratings)}
			Current User Img: {user.profileImage}
		</div>
	);
};

export default Page;
