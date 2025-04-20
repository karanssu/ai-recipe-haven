"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ingredient {
	id: string;
	ingredientId: string;
	quantity: number;
	unit: string;
}

interface CookingStep {
	id: string;
	number: number;
	step: string;
}

export default function Page() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [description, setDescription] = useState("");
	const [preparationMinutes, setPreparationMinutes] = useState(0);
	const [cookingMinutes, setCookingMinutes] = useState(0);
	const [serving, setServing] = useState(1);
	const [tags, setTags] = useState<string>("");
	const [ingredients, setIngredients] = useState<Ingredient[]>([
		{ id: crypto.randomUUID(), ingredientId: "", quantity: 1, unit: "" },
	]);
	const [steps, setSteps] = useState<CookingStep[]>([
		{ id: crypto.randomUUID(), number: 1, step: "" },
	]);

	const addIngredient = () =>
		setIngredients((prev) => [
			...prev,
			{ id: crypto.randomUUID(), ingredientId: "", quantity: 1, unit: "" },
		]);
	const removeIngredient = (id: string) =>
		setIngredients((prev) => prev.filter((i) => i.id !== id));

	const addStep = () =>
		setSteps((prev) => [
			...prev,
			{ id: crypto.randomUUID(), number: prev.length + 1, step: "" },
		]);
	const removeStep = (id: string) =>
		setSteps((prev) => prev.filter((s) => s.id !== id));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			name,
			imageUrl,
			description,
			preparationMinutes,
			cookingMinutes,
			serving,
			tags: tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			ingredients: ingredients.map(({ ingredientId, quantity, unit }) => ({
				ingredientId,
				quantity,
				unit,
			})),
			cookingSteps: steps.map(({ number, step }) => ({ number, step })),
		};

		const res = await fetch("/api/recipe", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			router.push("/recipe");
		} else {
			alert("Failed to create recipe");
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl my-10">
			<h1 className="text-3xl font-bold text-center mb-6">Create New Recipe</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Name & Image */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					<div>
						<label className="block font-semibold mb-1">Image URL</label>
						<input
							type="url"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
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
				<div>
					<label className="block font-semibold mb-1">
						Tags (comma‑separated)
					</label>
					<input
						type="text"
						required
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						placeholder="e.g. vegan, gluten-free"
						className="w-full border border-gray-300 rounded-lg px-3 py-2"
					/>
				</div>

				{/* Ingredients */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold">Ingredients</h2>
						<button
							type="button"
							onClick={addIngredient}
							className="text-green-600 hover:underline"
						>
							+ Add
						</button>
					</div>
					{ingredients.map((ing) => (
						<div key={ing.id} className="grid grid-cols-5 gap-2 items-end">
							<input
								type="text"
								required
								placeholder="Ingredient ID"
								value={ing.ingredientId}
								onChange={(e) =>
									setIngredients((prev) =>
										prev.map((x) =>
											x.id === ing.id
												? { ...x, ingredientId: e.target.value }
												: x
										)
									)
								}
								className="col-span-2 border rounded-lg px-2 py-1"
							/>
							<input
								type="number"
								min={0}
								placeholder="Qty"
								value={ing.quantity}
								onChange={(e) =>
									setIngredients((prev) =>
										prev.map((x) =>
											x.id === ing.id ? { ...x, quantity: +e.target.value } : x
										)
									)
								}
								className="border rounded-lg px-2 py-1"
							/>
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Unit"
									value={ing.unit}
									onChange={(e) =>
										setIngredients((prev) =>
											prev.map((x) =>
												x.id === ing.id ? { ...x, unit: e.target.value } : x
											)
										)
									}
									className="border rounded-lg px-2 py-1"
								/>
								<button
									type="button"
									onClick={() => removeIngredient(ing.id)}
									className="text-red-500 hover:underline text-sm"
								>
									Remove
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Cooking Steps */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold">Cooking Steps</h2>
						<button
							type="button"
							onClick={addStep}
							className="text-green-600 hover:underline"
						>
							+ Add
						</button>
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
							<button
								type="button"
								onClick={() => removeStep(st.id)}
								className="text-red-500 hover:underline text-sm"
							>
								Remove
							</button>
						</div>
					))}
				</div>

				{/* Submit */}
				<div className="text-center mt-6">
					<button
						type="submit"
						className="px-8 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
					>
						Create Recipe
					</button>
				</div>
			</form>
		</div>
	);
}
