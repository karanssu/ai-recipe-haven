import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";

const getRecipes = async () => {
	"use server";

	const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe`, {
		method: "GET",
		referrer: process.env.NEXT_PUBLIC_APP_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();
	const result: RecipeCardDef[] = data?.recipes || [];
	return result;
};

const Page = async () => {
	const recipes = await getRecipes();

	return (
		<>
			{/* I want a div below with the width of whole screen and content center, with RecipeCard inside it, if there are more recipecard then they move to next line */}
			<div className="mt-10 px-10 py-5 flex flex-wrap gap-5 justify-start items-start w-full ">
				{recipes.map((recipe) => (
					<RecipeCard key={recipe._id} recipe={recipe} />
				))}
			</div>
		</>
	);
};

export default Page;
