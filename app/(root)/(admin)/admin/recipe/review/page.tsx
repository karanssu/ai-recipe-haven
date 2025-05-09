"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PencilEdit02Icon as EditIcon } from "hugeicons-react";
import { Delete01Icon as TrashIcon } from "hugeicons-react";
import { FloppyDiskIcon as SaveIcon } from "hugeicons-react";
import { ThumbsUpIcon as LikeIcon } from "hugeicons-react";
import Image from "next/image";
import { RecipeReview, SessionUser } from "@/app/lib/definitions";
import { verifySession } from "@/app/lib/dal";

const ManageReviewsPage = () => {
	const [user, setUser] = useState<SessionUser | null>(null);
	const [reviews, setReviews] = useState<RecipeReview[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const loaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const session = await verifySession();
			if (session) setUser({ ...session, _id: session.userId });
		};
		fetchUser();
	}, []);

	// Fetch reviews
	const fetchReviews = useCallback(async () => {
		if (!user) return;
		if (isLoading || !hasMore) return;
		setIsLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/review?page=${page}&limit=5`,
				{
					cache: "no-store",
				}
			);
			const { reviews: newReviews, hasMore: more } = await res.json();
			if (newReviews.length === 0) {
				setHasMore(false);
			} else {
				setReviews((prev) => {
					const merged = [...prev, ...newReviews];
					const seen = new Set<string>();
					return merged.filter((msg) => {
						if (seen.has(msg._id)) return false;
						seen.add(msg._id);
						return true;
					});
				});
				setPage((prev) => prev + 1);
				setHasMore(more);
			}
		} catch (err) {
			console.error("Failed to load reviews", err);
		} finally {
			setIsLoading(false);
		}
	}, [page, isLoading, hasMore, user]);

	// Initial load
	useEffect(() => {
		if (user) {
			fetchReviews();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) fetchReviews();
			},
			{ threshold: 1.0 }
		);
		const el = loaderRef.current;
		if (el) observer.observe(el);
		return () => {
			if (el) observer.unobserve(el);
		};
	}, [fetchReviews]);

	// Delete handler
	const handleDelete = async (id: string | number) => {
		if (!confirm("Are you sure you want to delete this review?")) return;
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/review/${id}`,
				{ method: "DELETE" }
			);
			if (res.ok) setReviews((prev) => prev.filter((r) => r._id !== id));
		} catch (err) {
			console.error("Delete failed", err);
		}
	};

	// Edit state
	const [editingId, setEditingId] = useState<string | number | null>(null);
	const [editText, setEditText] = useState("");

	const startEdit = (id: string | number, current: string) => {
		setEditingId(id);
		setEditText(current);
	};
	const saveEdit = async () => {
		if (!editingId) return;
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
				setReviews((prev) =>
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

	const isReviewLiked = (
		likes: { _id: string }[] | undefined,
		userId: string | number | undefined
	) => {
		if (!likes || !userId) {
			return false;
		}

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

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Manage Reviews</h1>
			<div className="space-y-4">
				{reviews.map((rev) => (
					<div
						key={rev._id}
						className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
					>
						<div className="flex items-start">
							<div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
								<Image
									src={rev.user?.profileImage || "/default-profile.svg"}
									alt={rev.user?.name || "Default profile image"}
									width={48}
									height={48}
									className={`object-cover w-full h-full${
										!rev.user?.profileImage ? " p-2" : ""
									}`}
								/>
							</div>
							<div>
								<div className="font-semibold">
									{rev.user?.name || "Anonymous"}
								</div>
								<div className="text-gray-600 text-sm">
									{new Date(rev.date).toLocaleString()}
								</div>
								<div className="mt-2">
									{editingId === rev._id ? (
										<textarea
											className="w-full border rounded p-2"
											value={editText}
											onChange={(e) => setEditText(e.target.value)}
										/>
									) : (
										<p className="text-gray-800">{rev.review}</p>
									)}
								</div>

								<div className="flex items-center text-gray-500 text-sm mt-3">
									{isReviewLiked(rev.likes, user?._id.toString()) ? (
										<LikeIcon
											fill="true"
											className="text-primaryBg fill-primaryBg w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110"
											onClick={() =>
												handleLikeReview(rev._id, user?._id, setReviews)
											}
										/>
									) : (
										<LikeIcon
											fill="false"
											className="text-primaryBg fill-transparent w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-110"
											onClick={() =>
												handleLikeReview(rev._id, user?._id, setReviews)
											}
										/>
									)}
									<div className="ml-2">{rev.likes?.length}</div>
								</div>
							</div>
						</div>
						<div className="mt-4 md:mt-0 flex space-x-2">
							{editingId === rev._id ? (
								<button
									onClick={saveEdit}
									className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
								>
									<SaveIcon className="w-5 h-5" />
								</button>
							) : (
								<button
									onClick={() => startEdit(rev._id, rev.review)}
									className="p-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
								>
									<EditIcon className="w-5 h-5" />
								</button>
							)}
							<button
								onClick={() => handleDelete(rev._id)}
								className="p-1 bg-red-500 text-white hover:bg-red-600 rounded"
							>
								<TrashIcon className="w-5 h-5" />
							</button>
						</div>
					</div>
				))}
			</div>

			{hasMore && (
				<div ref={loaderRef} className="text-center py-4 text-gray-500">
					Loading more...
				</div>
			)}
		</div>
	);
};

export default ManageReviewsPage;
