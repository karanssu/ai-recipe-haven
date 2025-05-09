"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PlusSignSquareIcon as AddIcon } from "hugeicons-react";
import { Delete01Icon as TrashIcon } from "hugeicons-react";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import { verifySession } from "@/app/lib/dal";
import Image from "next/image";

interface IngredientOption {
	id: string;
	name: string;
}
interface Ingredient {
	id: string;
	name: string;
	quantity: number;
	unit: string;
}
interface CookingStep {
	id: string;
	number: number;
	step: string;
}

export default function EditRecipePage() {
	const router = useRouter();
	const { recipeId } = useParams();

	// form state
	const [name, setName] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [description, setDescription] = useState("");
	const [preparationMinutes, setPreparationMinutes] = useState(0);
	const [cookingMinutes, setCookingMinutes] = useState(0);
	const [serving, setServing] = useState(1);

	const [tagOptions, setTagOptions] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
	const [showTagSuggestions, setTagShowSuggestions] = useState(false);

	const [ingredientOptions, setIngredientOptions] = useState<
		IngredientOption[]
	>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([
		{ id: crypto.randomUUID(), name: "", quantity: 1, unit: "" },
	]);
	const [suggestionsById, setSuggestionsById] = useState<
		Record<string, string[]>
	>({});
	const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(
		null
	);

	const [steps, setSteps] = useState<CookingStep[]>([
		{ id: crypto.randomUUID(), number: 1, step: "" },
	]);

	// fetch master data + recipe
	useEffect(() => {
		// fetch tags & ingredients in parallel
		fetch("/api/recipe/tag")
			.then((res) => res.json())
			.then((data) => setTagOptions(data.tags || []))
			.catch(console.error);

		fetch("/api/recipe/ingredient")
			.then((res) => res.json())
			.then((data) => setIngredientOptions(data.ingredients || []))
			.catch(console.error);

		// fetch existing recipe
		fetch(`/api/recipe/${recipeId}`)
			.then((res) => res.json())
			.then(({ recipe }) => {
				setName(recipe.name);
				setImageUrl(recipe.imageUrl || "");
				setDescription(recipe.description || "");
				setPreparationMinutes(recipe.preparationMinutes);
				setCookingMinutes(recipe.cookingMinutes);
				setServing(recipe.serving || 1);
				setSelectedTags(recipe.tags || []);
				// map incoming to your shape
				setIngredients(
					recipe.ingredients.map(
						(ing: { name: string; quantity: number; unit: string }) => ({
							id: crypto.randomUUID(),
							name: ing.name,
							quantity: ing.quantity,
							unit: ing.unit,
						})
					)
				);
				setSteps(
					recipe.cookingSteps.map((st: { number: number; step: string }) => ({
						id: crypto.randomUUID(),
						number: st.number,
						step: st.step,
					}))
				);
			})
			.catch(console.error);
	}, [recipeId]);

	useEffect(() => {
		if (!tagInput) return setTagSuggestions([]);
		const lower = tagInput.toLowerCase();
		setTagSuggestions(
			tagOptions
				.filter(
					(t) => t.toLowerCase().includes(lower) && !selectedTags.includes(t)
				)
				.slice(0, 10)
		);
	}, [tagInput, tagOptions, selectedTags]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleIngredientNameChange = (id: string, value: string) => {
		setIngredients((prev) =>
			prev.map((ing) => (ing.id === id ? { ...ing, name: value } : ing))
		);

		if (!value) {
			setActiveSuggestionId(null);
			return;
		}

		const lower = value.toLowerCase();
		const matched = ingredientOptions
			.filter((opt) => opt.name.toLowerCase().includes(lower))
			.map((opt) => opt.name)
			.slice(0, 10);

		setSuggestionsById((all) => ({
			...all,
			[id]: matched,
		}));
		setActiveSuggestionId(id);
	};

	const getTitleCase = (str: string) =>
		str
			.toLowerCase()
			.split(" ")
			.map((w) => w[0].toUpperCase() + w.slice(1))
			.join(" ");

	const handleTagSubmit = () => {
		const val = getTitleCase(tagInput.trim());
		if (val && !selectedTags.includes(val)) {
			setSelectedTags((prev) => [...prev, val]);
			if (!tagOptions.includes(val)) setTagOptions((prev) => [...prev, val]);
		}
		setTagInput("");
		setTagShowSuggestions(false);
	};

	const addIngredient = () =>
		setIngredients((prev) => [
			...prev,
			{ id: crypto.randomUUID(), name: "", quantity: 1, unit: "" },
		]);
	const removeIngredient = (id: string) =>
		setIngredients((prev) => prev.filter((i) => i.id !== id));

	const addStep = () =>
		setSteps((prev) => [
			...prev,
			{ id: crypto.randomUUID(), number: prev.length + 1, step: "" },
		]);

	const removeStep = (id: string) =>
		setSteps((prev) => {
			const filtered = prev.filter((s) => s.id !== id);
			return filtered.map((s, idx) => ({
				...s,
				number: idx + 1,
			}));
		});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0] ?? null;
		if (selected) {
			const url = URL.createObjectURL(selected);
			setFile(selected);
			setPreviewUrl(url);
		}
	};

	const uploadToS3 = async (file: File): Promise<string> => {
		if (!file) return "";

		const fileBaseName = file.name.substring(0, file.name.lastIndexOf("."));
		const fileExtension = file.name.substring(file.name.lastIndexOf("."));

		const sanitizedBaseNmae = fileBaseName.replaceAll
			? fileBaseName.replaceAll(" ", "-")
			: fileBaseName.replace(/\s+/g, "-");

		const finalFileName = `${sanitizedBaseNmae}-${Date.now()}${fileExtension}`;

		const res = await fetch(
			`/api/recipe/image?filename=${encodeURIComponent(
				finalFileName
			)}&contentType=${encodeURIComponent(file.type)}`
		);
		const { url, key } = await res.json();

		await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": file.type },
			body: file,
		});

		return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const session = await verifySession();
		const userId = session?.userId;

		let newImageUrl = imageUrl;
		if (file) {
			newImageUrl = await uploadToS3(file);
			setImageUrl(newImageUrl);
		}

		const payload = {
			name,
			userId,
			imageUrl: newImageUrl,
			description,
			preparationMinutes,
			cookingMinutes,
			serving,
			tags: selectedTags,
			ingredients: ingredients.map(({ name, quantity, unit }) => ({
				name,
				quantity,
				unit,
			})),
			cookingSteps: steps.map(({ number, step }) => ({ number, step })),
		};

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/recipe/${recipeId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			}
		);
		if (res.ok) router.push("/recipe/my");
		else alert("Failed to update recipe");
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl my-10">
			<h1 className="text-3xl font-bold text-center mb-6">Edit Recipe</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Name & Image */}
				<div>
					<label className="block font-semibold mb-1">Recipe Name</label>
					<input
						type="text"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block font-semibold mb-1">Upload Image</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full"
						/>
					</div>
					<div>
						<label className="block font-semibold mb-1">Preview Image</label>
						<Image
							src={previewUrl || imageUrl || "/default-recipe-image.jpg"}
							priority
							alt={"Recipe Preview Image"}
							width={300}
							height={300}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
							className="object-cover object-center"
						/>
					</div>
				</div>

				{/* Description */}
				<div>
					<label className="block font-semibold mb-1">Description</label>
					<textarea
						required
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
					/>
				</div>

				{/* Time & Serving */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label className="block font-semibold mb-1">Prep Minutes</label>
						<input
							type="number"
							min={0}
							value={preparationMinutes}
							onChange={(e) => setPreparationMinutes(+e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block font-semibold mb-1">Cook Minutes</label>
						<input
							type="number"
							min={0}
							value={cookingMinutes}
							onChange={(e) => setCookingMinutes(+e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block font-semibold mb-1">Serving</label>
						<input
							type="number"
							min={1}
							value={serving}
							onChange={(e) => setServing(+e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
						/>
					</div>
				</div>

				{/* Tags */}
				<div className="relative">
					<label className="block font-semibold mb-1">Tags</label>
					<div className="flex flex-wrap gap-2 mb-1">
						{/* show added tags */}
						{selectedTags.map((tag) => (
							<span
								key={tag}
								className="flex items-center bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm"
							>
								{tag}

								<div
									className="cursor-pointer"
									onClick={() =>
										setSelectedTags((prev) => prev.filter((t) => t !== tag))
									}
								>
									<CloseIcon className="ml-2 w-4 h-4 stroke-2 text-green-600 hover:text-green-800" />
								</div>
							</span>
						))}

						{/* input for new tags */}
						<input
							type="text"
							value={tagInput}
							onChange={(e) => {
								setTagInput(e.target.value);
								setTagShowSuggestions(true);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === ",") {
									e.preventDefault();

									handleTagSubmit();
								}
							}}
							placeholder="Type to add a tag"
							className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
						/>

						<div className="cursor-pointer w-8" onClick={handleTagSubmit}>
							<AddIcon className="h-full w-full hover:text-primaryBgHover" />
						</div>
					</div>

					{/* suggestions dropdown */}
					{showTagSuggestions && tagSuggestions.length > 0 && (
						<div className="relative">
							{/* Close button in top-right */}
							<button
								onClick={() => setTagShowSuggestions(false)}
								aria-label="Close suggestions"
								className="absolute top-2 right-5 z-20 bg-transparent hover:bg-gray-300 text-gray-400 hover:text-gray-500 rounded"
							>
								<CloseIcon className="w-5 h-5" />
							</button>
							<ul className="absolute z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto rounded-md">
								{tagSuggestions.map((s) => (
									<li
										key={s}
										onClick={() => {
											setSelectedTags((prev) => [...prev, s]);
											setTagInput("");
											setTagShowSuggestions(false);
										}}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
									>
										{s}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				{/* Ingredients */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold">Ingredients</h2>
						<div className="cursor-pointer" onClick={addIngredient}>
							<AddIcon className="w-6 h-6 hover:text-primaryBgHover" />
						</div>
					</div>
					{ingredients.map((ing) => (
						<div
							key={ing.id}
							className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end pb-5 md:pb-0"
						>
							<div className="relative col-span-2">
								<input
									type="text"
									required
									value={ing.name}
									onChange={(e) =>
										handleIngredientNameChange(ing.id, e.target.value)
									}
									placeholder="Ingredient name"
									className="w-full border rounded-lg px-2 py-1"
								/>
								{activeSuggestionId === ing.id &&
									suggestionsById[ing.id]?.length > 0 && (
										<div className="relative">
											{/* Close button in top-right */}
											<button
												onClick={() => setActiveSuggestionId(null)}
												aria-label="Close ingredient suggestions"
												className="absolute top-2 right-5 z-20 bg-transparent hover:bg-gray-300 text-gray-400 hover:text-gray-500 rounded"
											>
												<CloseIcon className="w-5 h-5" />
											</button>
											<ul className="absolute left-0 top-full z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto rounded-md">
												{suggestionsById[ing.id]!.map((s) => (
													<li
														key={s}
														onClick={() => {
															handleIngredientNameChange(ing.id, s);
															setActiveSuggestionId(null);
														}}
														className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
													>
														{s}
													</li>
												))}
											</ul>
										</div>
									)}
							</div>
							<input
								type="number"
								min={0.01}
								step={0.01}
								value={ing.quantity}
								onChange={(e) =>
									setIngredients((prev) =>
										prev.map((x) =>
											x.id === ing.id
												? { ...x, quantity: parseFloat(e.target.value) }
												: x
										)
									)
								}
								placeholder="Quantity"
								className="border rounded-lg px-2 py-1"
							/>

							<div className="flex flex-row md:flex-row gap-2">
								<input
									type="text"
									value={ing.unit}
									onChange={(e) =>
										setIngredients((prev) =>
											prev.map((x) =>
												x.id === ing.id ? { ...x, unit: e.target.value } : x
											)
										)
									}
									placeholder="Unit (optional)"
									className="border rounded px-2 py-1 ml-2"
								/>
								<div
									onClick={() => removeIngredient(ing.id)}
									className="cursor-pointer"
								>
									<TrashIcon className="w-6 h-6 hover:text-red-500" />
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Cooking Steps */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold">Cooking Steps</h2>
						<div onClick={addStep} className="cursor-pointer">
							<AddIcon className="w-6 h-6 hover:text-primaryBgHover" />
						</div>
					</div>
					{steps.map((st) => (
						<div key={st.id} className="flex gap-2 items-center">
							<span className="font-semibold">{st.number}.</span>
							<input
								type="text"
								required
								placeholder="Describe this step..."
								value={st.step}
								onChange={(e) =>
									setSteps((prev) =>
										prev.map((x) =>
											x.id === st.id ? { ...x, step: e.target.value } : x
										)
									)
								}
								className="flex-1 border rounded-lg px-2 py-1"
							/>
							<div onClick={() => removeStep(st.id)} className="cursor-pointer">
								<TrashIcon className="w-6 h-6 hover:text-red-500" />
							</div>
						</div>
					))}
				</div>

				{/* Submit */}
				<div className="text-center mt-6">
					<button
						type="submit"
						className="px-8 py-3 bg-primaryBg text-primaryText rounded-full font-semibold hover:bg-primaryBgHover transition"
					>
						Update Recipe
					</button>
				</div>
			</form>
		</div>
	);
}
