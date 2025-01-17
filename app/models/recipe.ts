import mongoose, { Schema } from "mongoose";
import type { Recipe } from "../lib/definitions";

const RecipeSchema = new Schema<Recipe>({
	name: { type: String, required: true },
	image: { type: String, default: "" },
	description: { type: String, required: true },
	serving: { type: Number, default: 1 },
	preparationMinutes: { type: Number, default: 0 },
	cookingMinutes: { type: Number, default: 0 },
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	tags: { type: [String], default: [] },
	ratings: [
		{
			userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
			rating: { type: Number, required: true },
		},
	],
	calories: { type: Number, default: 0 },
	fatGrams: { type: Number, default: 0 },
	carbsGrams: { type: Number, default: 0 },
	fiberGrams: { type: Number, default: 0 },
	sugarGrams: { type: Number, default: 0 },
	proteinGrams: { type: Number, default: 0 },
	ingredients: [
		{
			name: { type: String, required: true },
			quantity: { type: Number, required: true },
			unit: { type: String, required: true },
		},
	],
	cookingSteps: [
		{
			number: { type: Number, required: true },
			step: { type: String, required: true },
			image: { type: String, default: "" },
		},
	],
});

const Recipe = mongoose.model<Recipe>("Recipe", RecipeSchema);

export default Recipe;
