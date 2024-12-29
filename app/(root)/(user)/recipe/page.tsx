import { RecipeCard } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
	const recipe: RecipeCard = {
		_id: "1",
		image:
			"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		tags: ["Indian", "Spicy", "Vegan"],
		user: {
			_id: "1",
			username: "karandpatel321",
			profileImage:
				"https://lh3.googleusercontent.com/a/ACg8ocLAnHar6JP6NbRjFWUZoAyKQIBRMPSqLTy3QN6-p0whKq_9KZw=s96-c",
		},
		name: "Longrecipewordthatwillbreakthewordwrap",
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

	const getRating = (ratings: { userId: string; rating: number }[]) => {
		const ratingsCount = ratings.length;
		if (ratingsCount === 0) return 0;
		const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
		return Math.round((sum / ratingsCount) * 2) / 2;
	};

	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold">
				All Recipes
			</div>

			<ul className="mt-10 text-center text-xl cursor-pointer">
				<li>
					<Link href={`/recipe/1`}>Recipe 1</Link>
				</li>
				<li>
					<Link href={`/recipe/2`}>Recipe 2</Link>
				</li>
				<li>
					<Link href={`/recipe/3`}>Recipe 3</Link>
				</li>
				<li>
					<Link href={`/recipe/4`}>Recipe 4</Link>
				</li>
				<li>
					<Link href={`/recipe/5`}>Recipe 5</Link>
				</li>
			</ul>

			<div className="mt-10 flex items-center justify-center">
				{/* Recipe Card */}
				<div className="bg-green-100 w-80 rounded-lg border-gray-200 border-2 shadow-lg">
					<div className="relative w-full h-[200px] overflow-hidden flex items-center justify-center rounded-t-lg">
						<Image
							src={recipe.image}
							alt={recipe.name}
							fill={true}
							className="object-cover object-center"
						/>
					</div>

					<div className="bg-red-100 p-4">
						<div className="flex justify-start">
							{recipe.tags?.map((tag) => (
								<span
									key={tag}
									className="mr-2 bg-Green text-gray-900 px-3 py-1 text-sm font-semibold"
								>
									{tag}
								</span>
							))}
						</div>

						<div className="flex mt-2">
							<div className="flex items-center">
								<Image
									src={recipe.user.profileImage}
									alt={recipe.user.username}
									width={40}
									height={40}
									className="rounded-full"
								/>
								<span className="ml-2 text-gray-400">
									@{recipe.user.username}
								</span>
							</div>
						</div>

						<div className="bg-yellow-100 mt-2 text-lg break-words">
							{recipe.name}
						</div>

						<div className="mt-2 flex text-sm">
							<div className="text-center">
								<span>Rating: {getRating(recipe.ratings ?? [])}</span>
							</div>
							<div className="text-center">
								<span>Level: {recipe.level}</span>
							</div>
							<div className="text-center">
								<span>People: {recipe.people}</span>
							</div>
							<div className="text-center">
								<span>Calories: {recipe.calories}</span>
							</div>
							<div className="text-center">
								<span>Cooking Time: {recipe.cookingTime}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
