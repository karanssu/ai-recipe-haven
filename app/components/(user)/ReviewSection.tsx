"use client";

import { ThumbsUpIcon as LikeIcon } from "hugeicons-react";
import { PencilEdit02Icon as EditIcon } from "hugeicons-react";
import { Delete01Icon as TrashIcon } from "hugeicons-react";
import { FloppyDiskIcon as SaveIcon } from "hugeicons-react";
import { Cancel01Icon as CancelIcon } from "hugeicons-react";
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
	const [editingId, setEditingId] = useState<string | number | null>(null);
	const [editText, setEditText] = useState("");

	const startEdit = (id: string | number, current: string) => {
		setEditingId(id);
		setEditText(current);
	};

	const saveEdit = async () => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/review/${editingId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ review: editText }),
				}
			);
			if (res.ok) {
				setRecipeReviews((prev) =>
					prev.map((r) =>
						r._id === editingId ? { ...r, review: editText } : r
					)
				);
				setEditingId(null);
			}
		} catch (err) {
			console.error("Edit failed", err);
		}
	};

	const handleDelete = async (reviewId: string | number) => {
		if (!confirm("Are you sure you want to delete this review?")) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/review/${reviewId}`,
				{ method: "DELETE" }
			);
			if (res.ok) {
				setRecipeReviews((prev) => prev.filter((r) => r._id !== reviewId));
			}
		} catch (err) {
			console.error("Delete failed", err);
		}
	};

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
					className="mb-8 space-y-4"
				>
					<textarea
						name="review"
						value={reviewText}
						onChange={(e) => setReviewText(e.target.value)}
						required
						rows={3}
						placeholder="Write your review..."
						className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryBg transition-all duration-200 resize-none"
					/>
					<button
						type="submit"
						className="inline-block px-6 py-2 rounded-lg bg-primaryBg hover:bg-primaryBgHover text-gray-900 font-semibold transition-colors duration-200 shadow-md"
					>
						Submit Review
					</button>
				</form>
			)}

			<div className="bg-white p-6 rounded-xl shadow-xl">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Reviews ({recipeReviews?.length || 0})
				</h2>
				{recipeReviews?.map((review) => (
					<div
						key={review._id}
						className="border-gray-200 p-4 mt-5 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
					>
						<div>
							<div className="flex items-center space-x-4">
								<div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
									<Image
										src={review.user?.profileImage || "/default-profile.svg"}
										alt={review.user?.name || "Default profile image"}
										width={40}
										height={40}
										className={`object-cover w-full h-full${
											!review.user?.profileImage ? " p-2" : ""
										}`}
									/>
								</div>
								<div>
									<p className="text-gray-800 font-semibold">
										{review.user?.name || "Anonymous"}
									</p>
									<p className="text-gray-500 text-sm">
										{new Date(review.date).toLocaleString()}
									</p>
								</div>
							</div>

							<div className="mt-4">
								{editingId === review._id ? (
									<textarea
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className="w-full border rounded p-2"
									/>
								) : (
									<p className="text-gray-700 leading-relaxed">
										{review.review}
									</p>
								)}
							</div>

							<div className="flex items-center text-gray-500 text-sm mt-3">
								{isReviewLiked(review.likes, user?._id.toString()) ? (
									<LikeIcon
										fill="true"
										className="text-primaryBg fill-primaryBg w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110"
										onClick={() =>
											handleLikeReview(review._id, user?._id, setRecipeReviews)
										}
									/>
								) : (
									<LikeIcon
										fill="false"
										className="text-primaryBg fill-transparent w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110"
										onClick={() =>
											handleLikeReview(review._id, user?._id, setRecipeReviews)
										}
									/>
								)}
								<div className="ml-2">{review.likes?.length}</div>
							</div>
						</div>

						{(user?.role === "superadmin" ||
							(user?.role === "admin" &&
								(review.user?.role === "admin" ||
									review.user?.role === "user")) ||
							(user?.role === "user" && user?._id === review.user?._id)) && (
							<div className="mt-3 flex space-x-2 text-sm">
								{editingId === review._id ? (
									<>
										<button
											onClick={() => saveEdit()}
											className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
										>
											<SaveIcon className="w-5 h-5" />
										</button>
										<button
											onClick={() => setEditingId(null)}
											className="p-1 bg-gray-300 text-white hover:bg-gray-400 rounded"
										>
											<CancelIcon className="w-5 h-5" />
										</button>
									</>
								) : (
									<>
										<button
											onClick={() => startEdit(review._id, review.review)}
											className="p-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
										>
											<EditIcon className="w-5 h-5" />
										</button>
										<button
											onClick={() => handleDelete(review._id)}
											className="p-1 bg-red-500 text-white hover:bg-red-600 rounded"
										>
											<TrashIcon className="w-5 h-5" />
										</button>
									</>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</>
	);
};

export default ReviewSection;
