"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";
import Image from "next/image";

const Page = () => {
	const [recipes, setRecipes] = useState<RecipeCardDef[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const loaderRef = useRef<HTMLDivElement>(null);
	const [tagOptions, setTagOptions] = useState<string[]>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState("");
	const [sortBy, setSortBy] = useState("newest");

	const fetchRecipes = async (page: number): Promise<RecipeCardDef[]> => {
		const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe`);
		url.searchParams.append("page", page.toString());
		if (searchQuery) url.searchParams.append("search", searchQuery);
		if (filter) url.searchParams.append("filter", filter);
		if (sortBy) url.searchParams.append("sort", sortBy);

		const res = await fetch(url.toString(), {
			method: "GET",
			referrer: process.env.NEXT_PUBLIC_APP_URL,
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		const newRecipes: RecipeCardDef[] = data?.recipes || [];
		return newRecipes;
	};

	const loadMoreRecipes = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		const newRecipes = await fetchRecipes(page);
		if (newRecipes.length === 0) {
			setHasMore(false);
		} else {
			setRecipes((prev) => {
				const existingIds = new Set(prev.map((r) => r._id.toString()));
				const filteredNewRecipes = newRecipes.filter(
					(recipe) => !existingIds.has(recipe._id.toString())
				);
				return [...prev, ...filteredNewRecipes];
			});
			setPage((prev) => prev + 1);
		}
		setIsFetching(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, isFetching, searchQuery, filter, sortBy]);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const res = await fetch("/api/recipe/tag");
				const data = await res.json();
				setTagOptions(data.tags || []);
			} catch (err) {
				console.error("Failed to fetch tags", err);
			}
		};
		fetchTags();
	}, []);

	// Reset recipes if search, filter, or sort options change.
	useEffect(() => {
		setRecipes([]);
		setPage(0);
		setHasMore(true);
		loadMoreRecipes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery, filter, sortBy]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) {
					loadMoreRecipes();
				}
			},
			{ threshold: 1.0 }
		);

		const currentLoaderRef = loaderRef.current;
		if (currentLoaderRef) {
			observer.observe(currentLoaderRef);
		}
		return () => {
			if (currentLoaderRef) {
				observer.unobserve(currentLoaderRef);
			}
		};
	}, [loadMoreRecipes, hasMore]);

	return (
		<div className="p-10">
			{/* Search, Filter, and Sort Controls */}
			<div className="mb-6 px-5 md:px-10 flex flex-col md:flex-row items-stretch md:items-center gap-4">
				{/* Search Bar */}
				<input
					type="text"
					placeholder="Search recipes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primaryBg"
				/>

				{/* Filter Dropdown */}
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primaryBg"
				>
					<option value="">All Diets</option>
					{[...tagOptions]
						.sort((a, b) => a.localeCompare(b))
						.map((tag) => (
							<option key={tag} value={tag}>
								{tag}
							</option>
						))}
				</select>

				{/* Sort Dropdown */}
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-primaryBg"
				>
					<option value="newest">Newest</option>
					<option value="rating">Highest Rating</option>
					<option value="time">Cooking Time</option>
				</select>
			</div>

			{/* Recipe Cards */}
			<div className="flex flex-wrap justify-center items-stretch gap-8">
				{recipes.map((recipe) => (
					<div
						key={recipe._id}
						className="flex-1 min-w-[300px] max-w-72 rounded-lg shadow-lg cursor-pointer overflow-hidden"
					>
						<RecipeCard recipe={recipe} />
					</div>
				))}
			</div>

			{/* Loader for infinite scroll */}
			{hasMore && (
				<div
					ref={loaderRef}
					className="font-title font-semibold text-center mt-10 text-3xl"
				>
					<div>
						<Image
							src="/loading.gif"
							width={50}
							height={50}
							alt="Loading..."
							className="mx-auto mt-4"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
