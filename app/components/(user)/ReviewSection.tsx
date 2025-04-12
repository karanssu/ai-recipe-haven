"use client";

import { ThumbsUpIcon as LikeIcon } from "hugeicons-react";
import { RecipeReview, SessionUser } from "@/app/lib/definitions";
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

const isReviewLiked = (
	likes: { _id: string }[] | undefined,
	userId: string | number | undefined
) => {
	if (!likes || !userId) return false;
	return likes.some((like) => like._id?.toString() === userId);
};

const updateLikes = (
	reviewId: string | number,
	userId: string,
	setRecipeReviews: React.Dispatch<React.SetStateAction<RecipeReview[]>>
) => {
	setRecipeReviews((prevReviews) =>
		prevReviews.map((review) => {
			if (review._id === reviewId) {
				const liked = review.likes.some((like) => like._id === userId);

				const updatedLikes = liked
					? review.likes.filter((like) => like._id !== userId)
					: [...review.likes, { _id: userId }];
				return { ...review, likes: updatedLikes };
			}
			return review;
		})
	);
};

const handleLikeReview = async (
	reviewId: string | number,
	userId: string | number | undefined,
	setRecipeReviews: React.Dispatch<React.SetStateAction<RecipeReview[]>>
) => {
	if (!userId) return;

	await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/review/${reviewId}/like`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId }),
		}
	);

	updateLikes(reviewId.toString(), userId.toString(), setRecipeReviews);
};

const ReviewSection = ({
	user,
	recipeId,
}: {
	user: SessionUser | null;
	recipeId: string;
}) => {
	const [recipeReviews, setRecipeReviews] = useState([] as RecipeReview[]);
	const [reviewText, setReviewText] = useState("");
	const [reviewCount, setReviewCount] = useState(0);

	const handleSubmitReview = async (formData: FormData) => {
		await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}/review`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user?._id,
					review: formData.get("review")?.toString(),
					date: new Date(),
				}),
			}
		);

		setReviewCount((prevCount) => prevCount + 1);
		setReviewText("");
	};

	useEffect(() => {
		const fetchReviews = async () => {
			const reviews = await getRecipeReviews(recipeId);
			setRecipeReviews(reviews);
			setReviewCount(reviews.length);
		};
		fetchReviews();
	}, [recipeId, reviewCount]);

	return (
		<>
			{user && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						handleSubmitReview(formData);
					}}
					className="mb-6 space-y-4"
				>
					<textarea
						name="review"
						value={reviewText}
						onChange={(e) => setReviewText(e.target.value)}
						required
						rows={3}
						placeholder="Write your review..."
						className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:border-primaryBg"
					/>
					<button
						type="submit"
						className="px-6 py-2 bg-primaryBg text-white font-semibold rounded-md hover:bg-primaryBgHover transition"
					>
						Submit Review
					</button>
				</form>
			)}

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
						<div className="flex text-gray-500 text-sm mt-2 items-center">
							{isReviewLiked(review.likes, user?._id.toString()) ? (
								<LikeIcon
									fill="true"
									className="text-primaryBg fill-primaryBg w-5 h-5 cursor-pointer"
									onClick={() =>
										handleLikeReview(review._id, user?._id, setRecipeReviews)
									}
								/>
							) : (
								<LikeIcon
									fill="false"
									className="text-primaryBg fill-transparent w-5 h-5 cursor-pointer"
									onClick={() =>
										handleLikeReview(review._id, user?._id, setRecipeReviews)
									}
								/>
							)}

							<div className="ml-2">{review.likes?.length}</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default ReviewSection;
