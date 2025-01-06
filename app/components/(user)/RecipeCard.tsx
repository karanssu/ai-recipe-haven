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

const RecipeCard = ({ recipe }: { recipe: RecipeCardDef }) => {
	return (
		<Link
			href={`/recipe/${recipe._id}`}
			className="w-80 min-w-72 max-w-80 h-fit rounded-lg border-gray-200 border-2 shadow-lg cursor-pointer"
		>
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
							src={recipe.user.profileImage || "default-profile.svg"}
							alt={recipe.user.username}
							width={30}
							height={30}
							className={`rounded-full object-center object-cover bg-gray-200 ${
								!recipe.user.profileImage && "p-1"
							}`}
						/>
						<span className="ml-2 text-grayText font-normal">
							@{recipe.user.username}
						</span>
					</div>
				</div>

				<div className="mt-3 text-lg break-words">{recipe.name}</div>

				<div className="mt-3 flex text-sm space-x-4 justify-start items-center font-menu text-grayText font-medium">
					{recipe.ratings && (
						<div className="flex justify-center items-center">
							<span className="mr-2 flex justify-center items-center">
								<RatingIcon className="text-primaryBg w-4 h-4 inline-block" />
							</span>
							<span>{calculateRecipeRating(recipe.ratings)}</span>
						</div>
					)}
					{recipe.serving && (
						<div className="flex justify-center items-center">
							<span className="mr-2 flex justify-center items-center">
								<PeopleIcon className="text-primaryBg w-4 h-4 inline-block" />
							</span>
							<span>{recipe.serving}</span>
						</div>
					)}
					{recipe.calories && (
						<div className="flex justify-center items-center">
							<span className="mr-2 flex justify-center items-center">
								<CaloriesIcon className="text-primaryBg w-4 h-4 inline-block" />
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
						<div className="flex justify-center items-center">
							<span className="mr-2 flex justify-center items-center">
								<CookTimeIcon className="text-primaryBg w-4 h-4 inline-block" />
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
