"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PencilEdit02Icon as EditIcon } from "hugeicons-react";
import { Delete01Icon as TrashIcon } from "hugeicons-react";
import Image from "next/image";

interface Review {
	_id: string;
	recipeId: string;
	userId: string;
	review: string;
	likes: { userId: string }[];
	date: string;
	user?: { name: string; profileImage?: string };
	recipe?: { name: string };
}

const ManageReviewsPage = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const loaderRef = useRef<HTMLDivElement>(null);

	// Fetch reviews
	const fetchReviews = useCallback(async () => {
		if (isLoading || !hasMore) return;
		setIsLoading(true);
		try {
			const res = await fetch(`/api/admin/reviews?page=${page}&limit=10`, {
				cache: "no-store",
			});
			const data = await res.json();
			if (data.reviews.length === 0) {
				setHasMore(false);
			} else {
				setReviews((prev) => [...prev, ...data.reviews]);
				setPage((prev) => prev + 1);
			}
		} catch (err) {
			console.error("Failed to load reviews", err);
		} finally {
			setIsLoading(false);
		}
	}, [page, isLoading, hasMore]);

	// Initial load
	useEffect(() => {
		fetchReviews();
	}, []);

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
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this review?")) return;
		try {
			const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
			if (res.ok) setReviews((prev) => prev.filter((r) => r._id !== id));
		} catch (err) {
			console.error("Delete failed", err);
		}
	};

	// Edit state
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editText, setEditText] = useState("");

	const startEdit = (id: string, current: string) => {
		setEditingId(id);
		setEditText(current);
	};
	const saveEdit = async () => {
		if (!editingId) return;
		try {
			const res = await fetch(`/api/admin/reviews/${editingId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ review: editText }),
			});
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
							<div className="w-12 h-12 rounded-full overflow-hidden mr-4">
								{rev.user?.profileImage ? (
									<Image
										src={rev.user.profileImage}
										width={48}
										height={48}
										alt={rev.user.name}
										className="object-cover"
									/>
								) : (
									<div className="bg-gray-200 w-full h-full" />
								)}
							</div>
							<div>
								<div className="font-semibold">
									{rev.user?.name || "Anonymous"}
								</div>
								<div className="text-gray-600 text-sm">
									on {new Date(rev.date).toLocaleString()}
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
							</div>
						</div>
						<div className="mt-4 md:mt-0 flex space-x-2">
							{editingId === rev._id ? (
								<button
									onClick={saveEdit}
									className="px-3 py-1 bg-green-500 text-white rounded"
								>
									Save
								</button>
							) : (
								<button
									onClick={() => startEdit(rev._id, rev.review)}
									className="p-2 bg-blue-500 text-white rounded"
								>
									<EditIcon className="w-5 h-5" />
								</button>
							)}
							<button
								onClick={() => handleDelete(rev._id)}
								className="p-2 bg-red-500 text-white rounded"
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
