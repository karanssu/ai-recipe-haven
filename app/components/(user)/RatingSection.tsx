"use client";

import { useState } from "react";
import { StarIcon as StarIcon } from "hugeicons-react";
import { SessionUser } from "@/app/lib/definitions";

interface RatingSectionProps {
	recipeId: string;
	user: SessionUser | null;
}

const RatingSection = ({ recipeId, user }: RatingSectionProps) => {
	const [rating, setRating] = useState(0);
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
		setRating(star);
		submitRating(star);
	};

	return (
		<div className="flex items-center space-x-1 my-4">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					onMouseEnter={() => setHoverRating(star)}
					onMouseLeave={() => setHoverRating(0)}
					onClick={() => handleStarClick(star)}
					disabled={!user || isSubmitting}
					className="focus:outline-none bg-transparent hover:bg-transparent"
				>
					<StarIcon
						className={`w-6 h-6 ${
							(hoverRating || rating) >= star
								? "text-yellow-500 fill-yellow-500"
								: "text-gray-300"
						}`}
					/>
				</button>
			))}
		</div>
	);
};

export default RatingSection;
