import { RecipeCardDef } from "@/app/lib/definitions";
import Image from "next/image";
import { Clock01Icon as CookTimeIcon } from "hugeicons-react";
import { FireIcon as CaloriesIcon } from "hugeicons-react";
import { UserGroupIcon as PeopleIcon } from "hugeicons-react";
import { StarIcon as RatingIcon } from "hugeicons-react";
import Link from "next/link";
import {
	calculateRecipeRating,
	getDisplayCaloriesWithUnit,
	getDisplayTotalCookingTimeWithUnit,
} from "@/app/lib/recipeUtils";

const RecipeCard = ({
	recipe,
	redirectUrl,
}: {
	recipe: RecipeCardDef;
	redirectUrl: string;
}) => {
	return (
		<Link
			href={redirectUrl}
			className="w-80 min-w-72 max-w-80 h-fit rounded-lg shadow-lg cursor-pointer overflow-hidden"
		>
			<div className="relative w-full h-[200px] overflow-hidden flex items-center justify-center">
				<Image
					src={
						recipe.imageUrl && recipe.imageUrl !== ""
							? recipe.imageUrl
							: "/default-recipe-image.jpg"
					}
					priority
					alt={recipe.name}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover object-center"
				/>
			</div>

			<div className="p-4">
				<div className="flex flex-wrap gap-2">
					{recipe.tags?.slice(0, 3).map((tag) => (
						<div
							key={tag}
							className="bg-primaryBg px-3 py-1 text-sm font-bold rounded-lg font-menu whitespace-nowrap"
						>
							{tag}
						</div>
					))}
				</div>

				{(recipe?.user || recipe?.apiId) && (
					<div className="flex mt-3">
						<div className="flex items-center">
							<div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
								<Image
									src={
										recipe.apiId
											? "/chatbot.png"
											: recipe.user?.profileImage || "/default-profile.svg"
									}
									alt="Recipe User Profile Image"
									fill
									priority
									sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
									className={`object-cover object-center ${
										!recipe.user?.profileImage && "p-1"
									}`}
								/>
							</div>

							<span className="ml-2 text-grayText font-normal">
								{recipe.apiId ? "AI Recipe Haven" : recipe.user?.name}
							</span>
						</div>
					</div>
				)}

				<div className="mt-3 text-lg break-words">{recipe.name}</div>

				<div className="mt-3 flex flex-wrap gap-3 text-sm justify-start items-center font-menu text-grayText font-medium">
					{recipe.ratings && (
						<div className="flex justify-center items-center" title="Rating">
							<span className="mr-2 flex justify-center items-center">
								<RatingIcon
									fill="true"
									className="text-primaryBg fill-primaryBg w-5 h-5 inline-block stroke-2"
								/>
							</span>
							<span>{calculateRecipeRating(recipe.ratings)}</span>
						</div>
					)}
					{recipe.serving && (
						<div
							className="flex justify-center items-center"
							title="Serving Size"
						>
							<span className="mr-2 flex justify-center items-center">
								<PeopleIcon
									fill="true"
									className="text-primaryBg fill-primaryBg w-5 h-5 inline-block stroke-2"
								/>
							</span>
							<span>{recipe.serving}</span>
						</div>
					)}
					{recipe.calories && (
						<div className="flex justify-center items-center" title="Calories">
							<span className="mr-2 flex justify-center items-center">
								<CaloriesIcon
									fill="true"
									className="text-primaryBg fill-primaryBg w-5 h-5 inline-block stroke-2"
								/>
							</span>
							<span className="mr-1">
								{getDisplayCaloriesWithUnit(recipe.calories).calories}
							</span>
							<span>{getDisplayCaloriesWithUnit(recipe.calories).unit}</span>
						</div>
					)}
					{getDisplayTotalCookingTimeWithUnit(
						recipe.preparationMinutes,
						recipe.cookingMinutes
					).totalTime > 0 && (
						<div
							className="flex justify-center items-center"
							title="Total Cooking Time"
						>
							<span className="mr-2 flex justify-center items-center">
								<CookTimeIcon className="text-primaryBg w-5 h-5 inline-block stroke-2" />
							</span>
							<span>
								{
									getDisplayTotalCookingTimeWithUnit(
										recipe.preparationMinutes,
										recipe.cookingMinutes
									).totalTime
								}
								{
									getDisplayTotalCookingTimeWithUnit(
										recipe.preparationMinutes,
										recipe.cookingMinutes
									).unit
								}
							</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

export default RecipeCard;
