import { Schema, model, models, Document, Types } from "mongoose";

interface ICookingStep {
	number: number;
	step: string;
}

interface IRecipeIngredient {
	ingredientId: Types.ObjectId;
	quantity: number;
	unit: string;
}

export interface IRecipe extends Document {
	name: string;
	imageUrl?: string;
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
	tags: Types.ObjectId[];
	recipeIngredients: IRecipeIngredient[];
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
		quantity: { type: Number, required: true },
		unit: { type: String, required: true },
	},
	{ _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
	{
		name: { type: String, required: true, trim: true, index: true },
		imageUrl: { type: String, trim: true },
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
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tag",
			},
		],
		recipeIngredients: [RecipeIngredientSchema],
		cookingSteps: [CookingStepSchema],
	},
	{ timestamps: true }
);

export const Recipe = models.Recipe || model<IRecipe>("Recipe", RecipeSchema);
