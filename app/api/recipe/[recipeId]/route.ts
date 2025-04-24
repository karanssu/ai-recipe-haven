import { connectMongoDB } from "@/app/lib/mongodb";
import { Ingredient } from "@/app/models/ingredient.model";
import { Recipe as RecipeModel } from "@/app/models/recipe.model";
import { Ingredient as IngredientModel } from "@/app/models/ingredient.model";

import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import User from "@/app/models/user.model";
import { toTitleCase } from "@/app/lib/recipeUtils";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	await connectMongoDB();

	const { recipeId } = await params;

	if (!Types.ObjectId.isValid(recipeId)) {
		return NextResponse.json(
			{ error: "Invalid recipeId format" },
			{ status: 400 }
		);
	}

	await RecipeModel.findByIdAndDelete(recipeId);

	return NextResponse.json(
		{ message: "Recipe deleted successfully" },
		{ status: 200 }
	);
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ recipeId: string }> }
) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	try {
		await connectMongoDB();
		const { recipeId } = await params;
		const {
			name,
			userId,
			imageUrl,
			description,
			preparationMinutes,
			cookingMinutes,
			serving,
			tags,
			ingredients,
			cookingSteps,
			calories,
			fatGrams,
			carbsGrams,
			fiberGrams,
			sugarGrams,
			proteinGrams,
		} = await req.json();

		// Find the existing recipe
		const recipe = await RecipeModel.findById(recipeId);
		if (!recipe) {
			return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
		}

		const titleCaseTags = Array.from(
			new Set(
				tags.map((tag: string) => toTitleCase(tag.trim())).filter(Boolean)
			)
		);

		const uniqueIngredients = ingredients.filter(
			(
				ing: { name: string; quantity: number; unit: string },
				idx: number,
				arr: { name: string; quantity: number; unit: string }[]
			) =>
				idx ===
				arr.findIndex(
					(other) =>
						toTitleCase(other.name.trim()) === toTitleCase(ing.name.trim())
				)
		);

		const ingredientIds: typeof recipe.ingredients = [];
		for (const ing of uniqueIngredients) {
			const formattedName = toTitleCase(ing.name.trim());
			let ingredient = await IngredientModel.findOne({ name: formattedName });
			if (!ingredient) {
				ingredient = await IngredientModel.create({ name: formattedName });
			}

			const rawQuantity = ing.quantity || 1;
			const roundedQuantity =
				typeof rawQuantity === "number"
					? Math.round(rawQuantity * 100) / 100
					: 1;

			ingredientIds.push({
				ingredientId: ingredient._id,
				quantity: roundedQuantity,
				unit: ing.unit,
			});
		}
		// Assign only the updatable fields
		recipe.name = name ?? recipe.name;
		recipe.userId = userId ?? recipe.userId;
		recipe.imageUrl = imageUrl ?? recipe.imageUrl;
		recipe.description = description ?? recipe.description;
		recipe.preparationMinutes = preparationMinutes ?? recipe.preparationMinutes;
		recipe.cookingMinutes = cookingMinutes ?? recipe.cookingMinutes;
		recipe.serving = serving ?? recipe.serving;
		recipe.tags = titleCaseTags ?? recipe.tags;
		recipe.ingredients = ingredientIds;
		recipe.cookingSteps = cookingSteps ?? recipe.cookingSteps;
		recipe.calories = calories ?? recipe.calories;
		recipe.fatGrams = fatGrams ?? recipe.fatGrams;
		recipe.carbsGrams = carbsGrams ?? recipe.carbsGrams;
		recipe.fiberGrams = fiberGrams ?? recipe.fiberGrams;
		recipe.sugarGrams = sugarGrams ?? recipe.sugarGrams;
		recipe.proteinGrams = proteinGrams ?? recipe.proteinGrams;

		await recipe.save();

		return NextResponse.json({ recipe }, { status: 200 });
	} catch (err) {
		console.error("[UPDATE_RECIPE_ERROR]", err);
		return NextResponse.json(
			{ error: "Failed to update recipe" },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	const url = new URL(req.url);
	const recipeId = url.pathname.split("/").pop() || "";

	if (!recipeId) {
		return Response.json({ error: "Recipe ID is required" }, { status: 400 });
	}

	try {
		const recipe = await fetchRecipeById(recipeId);
		return Response.json({ recipe: recipe }, { status: 200 });
	} catch (err) {
		return Response.json({ error: err }, { status: 500 });
	}
}

const fetchRecipeById = async (recipeId: string) => {
	await connectMongoDB();
	let recipe = await RecipeModel.findById(recipeId).populate("ratings");

	if (!recipe) {
		throw new Error("Recipe not found");
	}

	const namedIngredients = await Promise.all(
		recipe.ingredients.map(
			async (ingredient: { _doc: object; ingredientId: string }) => {
				const ingredientName = await Ingredient.findById(
					ingredient.ingredientId
				).then((ing) => ing?.name || "Unknown Ingredient");

				return {
					...ingredient._doc,
					name: ingredientName,
				};
			}
		)
	);

	let user: {
		_id: string;
		name: string;
		profileImage: string;
	} | null = null;

	const recipeDoc = recipe._doc;
	if (recipeDoc.userId) {
		const u = await User.findById(recipeDoc.userId).select(
			"_id name profileImage"
		);

		if (u) {
			user = {
				_id: u._id.toString(),
				name: u.name,
				profileImage: u.profileImage,
			};
		}
	}

	recipe = { ...recipe._doc, ingredients: namedIngredients, user };

	return recipe;
};
