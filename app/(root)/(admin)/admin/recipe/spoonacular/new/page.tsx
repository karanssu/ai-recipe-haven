import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";

const fetchNewRecipes = async (number: number) => {
	"use server";

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/spoonacular/new?number=${number}`,
		{
			method: "GET",
			referrer: process.env.NEXT_PUBLIC_APP_URL,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const data = await res.json();
	const result: RecipeCardDef[] = data?.recipes || [];
	return result;
};

const Page = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string };
}) => {
	const number = searchParams.number ? parseInt(searchParams.number, 10) : 10;

	const recipes = await fetchNewRecipes(number);

	return (
		<>
			<div className="p-10">
				<div className="flex flex-wrap justify-center items-stretch gap-8">
					{recipes.map((recipe) => (
						<div
							key={recipe._id}
							className="flex-1 min-w-[300px] max-w-72 rounded-lg shadow-lg cursor-pointer overflow-hidden"
						>
							<RecipeCard recipe={recipe} />
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Page;
