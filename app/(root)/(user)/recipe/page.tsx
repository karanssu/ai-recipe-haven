import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";
import Link from "next/link";

const getRecipes = async () => {
	const result: RecipeCardDef[] = [];
	const recipe: RecipeCardDef = {
		_id: "999",
		image:
			"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		tags: ["Indian", "Spicy", "Vegan"],
		user: {
			_id: "1",
			username: "karandpatel321",
			profileImage:
				"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		},
		name: "Tofu Tava Masala with Roti and Salad",
		ratings: [
			{ userId: "1", rating: 5 },
			{ userId: "2", rating: 4 },
			{ userId: "3", rating: 1 },
		],
		level: "easy",
		people: 4,
		calories: 200,
		cookingTime: 30,
	};

	result.push({ ...recipe, _id: "1" });
	result.push({ ...recipe, _id: "2" });
	result.push({ ...recipe, _id: "3" });
	result.push({ ...recipe, _id: "4" });
	result.push({ ...recipe, _id: "5" });
	result.push({ ...recipe, _id: "6" });
	return result;
};

const Page = async () => {
	const recipes = await getRecipes();

	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold font-title">
				All Recipes
			</div>

			<ul className="mt-10 text-center text-xl cursor-pointer space-y-5 text-primaryText">
				<li>
					<Link className="underline" href={`/recipe/1`}>
						Recipe 1
					</Link>
				</li>
				<li>
					<Link className="underline" href={`/recipe/2`}>
						Recipe 2
					</Link>
				</li>
				<li>
					<Link className="underline" href={`/recipe/3`}>
						Recipe 3
					</Link>
				</li>
			</ul>

			<div className="mt-10 px-10 py-5 flex overflow-x-auto space-x-10">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe._id} recipe={recipe} />
				))}
			</div>
		</>
	);
};

export default Page;
