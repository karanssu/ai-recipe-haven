import { RecipeCard } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { Clock01Icon as CookTimeIcon } from "hugeicons-react";
import { FireIcon as CaloriesIcon } from "hugeicons-react";
import { UserGroupIcon as PeopleIcon } from "hugeicons-react";
import { ChartLineData01Icon as LevelIcon } from "hugeicons-react";
import { StarIcon as RatingIcon } from "hugeicons-react";

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

	const getRating = (ratings: { userId: string; rating: number }[]) => {
		const ratingsCount = ratings.length;
		if (ratingsCount === 0) return 0;
		const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
		return Math.round((sum / ratingsCount) * 2) / 2;
	};

	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold font-title text-primaryText">
				All Recipes
			</div>

			<ul className="mt-10 text-center text-xl cursor-pointer font-display space-y-5 text-primaryText">
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

			<div className="mt-10 flex items-center justify-center text-primaryText">
				{/* Recipe Card */}
				<div className="w-80 rounded-lg border-gray-200 border-2 shadow-lg">
					<div className="relative w-full h-[200px] overflow-hidden flex items-center justify-center rounded-t-lg">
						<Image
							src={recipe.image}
							alt={recipe.name}
							fill={true}
							className="object-cover object-center"
						/>
					</div>

					<div className="p-4">
						<div className="flex justify-start">
							{recipe.tags?.map((tag) => (
								<span
									key={tag}
									className="mr-2 bg-primaryBg px-3 py-1 text-sm font-bold font-menu"
								>
									{tag}
								</span>
							))}
						</div>

						<div className="flex mt-3">
							<div className="flex items-center">
								<Image
									src={recipe.user.profileImage}
									alt={recipe.user.username}
									width={30}
									height={30}
									className="rounded-full"
								/>
								<span className="ml-2 text-grayText font-display font-normal">
									@{recipe.user.username}
								</span>
							</div>
						</div>

						<div className="mt-3 text-lg break-words font-display">
							{recipe.name}
						</div>

						<div className="mt-3 flex text-sm space-x-4 justify-center items-center font-menu text-grayText font-medium">
							<div className="flex justify-center items-center cursor-default">
								<span className="mr-2 flex justify-center items-center">
									<RatingIcon className="text-primaryBg w-4 h-4 inline-block" />
								</span>
								<span>{getRating(recipe.ratings ?? [])}</span>
							</div>
							<div className="flex justify-center items-center cursor-default">
								<span className="mr-2 flex justify-center items-center">
									<LevelIcon className="text-primaryBg w-4 h-4 inline-block" />
								</span>
								<span>{recipe.level}</span>
							</div>
							<div className="flex justify-center items-center cursor-default">
								<span className="mr-2 flex justify-center items-center">
									<PeopleIcon className="text-primaryBg w-4 h-4 inline-block" />
								</span>
								<span>{recipe.people}</span>
							</div>
							<div className="flex justify-center items-center cursor-default">
								<span className="mr-2 flex justify-center items-center">
									<CaloriesIcon className="text-primaryBg w-4 h-4 inline-block" />
								</span>
								<span>{recipe.calories}</span>
							</div>
							<div className="flex justify-center items-center cursor-default">
								<span className="mr-2 flex justify-center items-center">
									<CookTimeIcon className="text-primaryBg w-4 h-4 inline-block" />
								</span>
								<span>{recipe.cookingTime}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page;
