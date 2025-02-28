import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";

const getRecipes = async (page: string) => {
	"use server";

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe?page=${page}`,
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
	searchParams: Promise<{ [key: string]: string }>;
}) => {
	const page = (await searchParams).page;

	const recipes = await getRecipes(page);

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
