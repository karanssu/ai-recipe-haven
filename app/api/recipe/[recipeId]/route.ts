import { connectMongoDB } from "@/app/lib/mongodb";
import { Ingredient } from "@/app/models/ingredient.model";
import { Recipe as RecipeModel } from "@/app/models/recipe.model";

import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

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

	recipe = { ...recipe._doc, ingredients: namedIngredients };

	return recipe;
};
