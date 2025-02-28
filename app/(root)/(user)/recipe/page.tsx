"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef } from "@/app/lib/definitions";
import Image from "next/image";

const RecipeInfiniteScroll = () => {
	const [recipes, setRecipes] = useState<RecipeCardDef[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const loaderRef = useRef<HTMLDivElement>(null);

	const fetchRecipes = async (page: number): Promise<RecipeCardDef[]> => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe?page=${page}`,
			{
				method: "GET",
				referrer: process.env.NEXT_PUBLIC_APP_URL,
				headers: { "Content-Type": "application/json" },
			}
		);
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
	}, [page, isFetching]);

	useEffect(() => {
		loadMoreRecipes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

export default RecipeInfiniteScroll;
