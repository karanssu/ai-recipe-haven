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
			<div className="flex justify-center p-10">
				<div className="flex flex-wrap justify-center gap-8">
					{recipes.map((recipe) => (
						<RecipeCard key={recipe._id} recipe={recipe} />
					))}
				</div>
			</div>
		</>
	);
};

export default Page;
