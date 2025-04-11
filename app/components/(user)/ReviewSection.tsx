"use client";

import { RecipeReview } from "@/app/lib/definitions";
import Image from "next/image";
import { useEffect, useState } from "react";

const getRecipeReviews = async (recipeId: string): Promise<RecipeReview[]> => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/review`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	const data = await res.json();
	return data.reviews || [];
};

const ReviewSection = ({ recipeId }: { recipeId: string }) => {
	const [recipeReviews, setRecipeReviews] = useState([] as RecipeReview[]);

	useEffect(() => {
		const fetchReviews = async () => {
			const reviews = await getRecipeReviews(recipeId);
			setRecipeReviews(reviews);
		};
		fetchReviews();
	});

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				Reviews ({recipeReviews?.length || 0})
			</h2>
			{recipeReviews?.map((review) => (
				<div key={review._id} className="border-t border-gray-200 py-4">
					<div className="flex items-center space-x-4">
						<div className="w-10 h-10 rounded-full overflow-hidden">
							{review.user?.profileImage ? (
								<Image
									src={review.user.profileImage}
									alt={review.user.name || "User"}
									width={40}
									height={40}
									className="object-cover"
								/>
							) : (
								<div className="bg-gray-300 w-full h-full" />
							)}
						</div>
						<div>
							<p className="text-gray-800 font-semibold">
								{review.user?.name || "Anonymous"}
							</p>
							<p className="text-gray-500 text-sm">
								{new Date(review.date).toLocaleDateString()}
							</p>
						</div>
					</div>
					<p className="text-gray-700 mt-2">{review.review}</p>
					<div className="text-gray-500 text-sm mt-2">
						Likes: {review.likes.length}
					</div>
				</div>
			))}
		</div>
	);
};

export default ReviewSection;
