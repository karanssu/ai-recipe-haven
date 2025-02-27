import { Schema, model, models, Document, Types } from "mongoose";

interface ICookingStep {
	number: number;
	step: string;
}

interface IRecipeIngredient {
	ingredientId: Types.ObjectId;
	quantity?: number;
	unit?: string;
}

export interface IRecipe extends Document {
	name: string;
	apiId: string;
	imageUrl?: string;
	description?: string;
	preparationMinutes: number;
	cookingMinutes: number;
	serving?: number;
	ratings: Types.ObjectId[];
	calories?: number;
	fatGrams?: number;
	carbsGrams?: number;
	fiberGrams?: number;
	sugarGrams?: number;
	proteinGrams?: number;
	tags: string[];
	ingredients: IRecipeIngredient[];
	cookingSteps: ICookingStep[];
}

const CookingStepSchema = new Schema<ICookingStep>(
	{
		number: { type: Number, required: true },
		step: { type: String, required: true },
	},
	{ _id: false }
);

const RecipeIngredientSchema = new Schema<IRecipeIngredient>(
	{
		ingredientId: {
			type: Schema.Types.ObjectId,
			ref: "Ingredient",
			required: true,
			index: true,
		},
		quantity: { type: Number, default: 1 },
		unit: { type: String, default: "" },
	},
	{ _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
	{
		name: { type: String, required: true, trim: true, index: true },
		apiId: { type: String, required: false, index: true },
		imageUrl: { type: String, trim: true },
		description: { type: String, trim: true, default: "" },
		preparationMinutes: { type: Number, default: 0 },
		cookingMinutes: { type: Number, default: 0 },
		serving: { type: Number },
		ratings: [
			{
				type: Schema.Types.ObjectId,
				ref: "Rating",
			},
		],
		calories: { type: Number },
		fatGrams: { type: Number },
		carbsGrams: { type: Number },
		fiberGrams: { type: Number },
		sugarGrams: { type: Number },
		proteinGrams: { type: Number },
		tags: [{ type: String, trim: true, index: true }],
		ingredients: [RecipeIngredientSchema],
		cookingSteps: [CookingStepSchema],
	},
	{ timestamps: true }
);

export const Recipe = models.Recipe || model<IRecipe>("Recipe", RecipeSchema);
