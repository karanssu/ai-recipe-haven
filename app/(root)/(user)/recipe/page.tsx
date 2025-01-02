import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";
import Link from "next/link";

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
