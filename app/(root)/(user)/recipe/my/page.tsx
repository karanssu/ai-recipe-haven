"use client";

import { verifySession } from "@/app/lib/dal";
import { useEffect, useState, useRef, useCallback } from "react";
import RecipeCard from "@/app/components/(user)/RecipeCard";
import { RecipeCardDef, SessionUser } from "@/app/lib/definitions";
import { Delete01Icon as TrashIcon } from "hugeicons-react";
import { PencilEdit02Icon as EditIcon } from "hugeicons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChatBot from "@/app/components/(user)/ChatBot";
import { calculateRecipeRating } from "@/app/lib/recipeUtils";

const Page = () => {
	const [user, setUser] = useState<SessionUser | null>(null);
	const [context, setContext] = useState("Context: None");
	const [recipes, setRecipes] = useState<RecipeCardDef[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const loaderRef = useRef<HTMLDivElement>(null);
	const [tagOptions, setTagOptions] = useState<string[]>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState("");
	const [sortBy, setSortBy] = useState("newest");

	const router = useRouter();

	const fetchUser = async () => {
		const session = await verifySession();
		if (session) {
			setUser({
				_id: session.userId,
				name: session.name,
				username: session.username,
				profileImage: session.profileImage,
				role: session.role,
			});
		} else {
			setUser(null);
		}
	};

	const updateContext = (recipes: RecipeCardDef[]) => {
		setContext(generateContext(recipes));
	};

	const generateContext = (recipes: RecipeCardDef[]): string => {
		if (recipes.length === 0) {
			return `
				Context: You are a friendly cooking assistant. Use ONLY the recipes below. User (${user?.name}) is on "My Recipes" but hasn't created any recipes yet. So do not suggest any recipes. Just say, paraphrase this sentence "No recipes available. Please create a recipe or go to the all recipe page for the recommendation.
					Never recommend or generate imaginary url like "example.com/".
				`;
		}

		const intro = `
			Context: You are a friendly cooking assistant. Use ONLY the recipes below.
			When you recommend one, don't use (**) or links in the plain form but give the response in HTML format with Tags, give a short blurb and then include a clickable link formatted as:
			<a style="color:#3b82f6;text-decoration:underline;" href="${process.env.NEXT_PUBLIC_APP_URL}/recipe/RECIPE_ID">
				RECIPE_NAME
			</a>
		`;

		const body = recipes
			.map((r, i) => {
				const url = `${process.env.NEXT_PUBLIC_APP_URL}/recipe/${r._id}`;
				return `
					Recipe ${i + 1}: ${r.name}
						• ID: ${r._id}
						• Author: ${r.user?.name ?? "Unknown"}
						• Tags: ${r.tags?.join(", ") ?? "None"}
						• Prep: ${r.preparationMinutes}m, Cook: ${r.cookingMinutes}m
						• Serves: ${r.serving}
						• Rating: ${calculateRecipeRating(r.ratings)}
						• URL: ${url}
				`;
			})
			.join("\n");

		return `${intro}\n${body}`.trim();
	};

	const fetchRecipes = async (page: number): Promise<RecipeCardDef[]> => {
		const session = await verifySession();
		if (!session) {
			return [];
		}

		const userId = session.userId;
		const url = new URL(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/my/${userId}`
		);
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
				const updatedRecipes = [...prev, ...filteredNewRecipes];
				updateContext(updatedRecipes);
				return updatedRecipes;
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
		fetchUser();
		updateContext([]);
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

	const handleDelete = async (id: string | number) => {
		if (confirm("Are you sure you want to delete this recipe?")) {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${id}`,
					{
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id }),
					}
				);
				if (res.ok) {
					setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
				} else {
					alert("Failed to delete the recipe.");
				}
			} catch (error) {
				console.error("Error deleting recipe:", error);
			}
		}
	};

	return (
		<>
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
							<RecipeCard
								recipe={recipe}
								redirectUrl={`/recipe/${recipe._id}`}
							/>

							<div className="flex justify-end gap-2 pb-4 pr-4">
								{/* Edit Button */}
								<button
									onClick={() => router.push(`/recipe/edit/${recipe._id}`)}
									className="p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white rounded"
								>
									<EditIcon size={20} />
								</button>

								{/* Delete Button */}
								<button
									onClick={() => handleDelete(recipe._id)}
									className="p-1 bg-transparent hover:bg-red-500 text-red-500 hover:text-white rounded"
								>
									<TrashIcon size={20} />
								</button>
							</div>
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
								unoptimized
								width={50}
								height={50}
								alt="Loading..."
								className="mx-auto mt-4"
							/>
						</div>
					</div>
				)}
			</div>

			{user && <ChatBot userId={user._id} context={context} />}
		</>
	);
};

export default Page;
