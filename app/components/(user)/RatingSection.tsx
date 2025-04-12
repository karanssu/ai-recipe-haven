"use client";

import { useEffect, useState } from "react";
import { StarIcon as StarIcon } from "hugeicons-react";
import { Recipe, SessionUser } from "@/app/lib/definitions";
import { calculateRecipeRating } from "@/app/lib/recipeUtils";

interface RatingSectionProps {
	recipeId: string;
	user: SessionUser | null;
	recipe: Recipe;
}

const RatingSection = ({ recipeId, user, recipe }: RatingSectionProps) => {
	const [recipeRatings, setRecipeRatings] = useState(recipe.ratings || []);
	const [userRating, setUserRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const submitRating = async (value: number) => {
		setIsSubmitting(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/rating`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						userId: user?._id,
						rating: value,
						date: new Date(),
					}),
				}
			);
			if (res.ok) {
				console.log("Rating submitted successfully");
			} else {
				console.error("Failed to submit rating");
			}
		} catch (error) {
			console.error("Error submitting rating", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStarClick = (star: number) => {
		setUserRating(star);
		setRecipeRatings((prevRatings) => {
			const existingRatingIndex = prevRatings.findIndex(
				(rating) => rating.userId === user?._id
			);
			if (existingRatingIndex !== -1) {
				const updatedRatings = [...prevRatings];
				updatedRatings[existingRatingIndex].rating = star;
				return updatedRatings;
			} else if (user?._id) {
				return [...prevRatings, { userId: user._id, rating: star }];
			}
			return prevRatings;
		});

		submitRating(star);
	};

	useEffect(() => {
		if (user) {
			const fetchUserRating = async () => {
				try {
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/rating/${user._id}`
					);
					if (res.ok) {
						const data = await res.json();
						if (data.rating) {
							setUserRating(data.rating.rating);
						}
					} else {
						console.error("Failed to fetch rating");
					}
				} catch (error) {
					console.error("Error fetching rating", error);
				}
			};
			fetchUserRating();
		}
	}, [user, recipeId]);

	return (
		<>
			<div className="mt-4 flex items-center space-x-4">
				<div className="text-primaryBgHover font-semibold text-lg transition-colors duration-200">
					Rating: {calculateRecipeRating(recipeRatings)}
				</div>
				<div className="text-gray-500 text-sm">
					({recipeRatings.length || 0})
				</div>
			</div>
			<div className="flex items-center space-x-2 my-4">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						onMouseEnter={() => setHoverRating(star)}
						onMouseLeave={() => setHoverRating(0)}
						onClick={() => handleStarClick(star)}
						disabled={!user || isSubmitting}
						className="focus:outline-none transition-colors duration-150 bg-transparent hover:bg-transparent"
					>
						<StarIcon
							className={`w-6 h-6 transition-transform duration-200 transform hover:scale-110 ${
								(hoverRating || userRating) >= star
									? "text-yellow-500 fill-yellow-500"
									: "text-gray-300"
							}`}
						/>
					</button>
				))}
			</div>
		</>
	);
};

export default RatingSection;
