import { Schema, model, models, Document } from "mongoose";

export interface IIngredient extends Document {
	name: string;
}

const IngredientSchema = new Schema<IIngredient>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

IngredientSchema.index({ name: 1 });

export const Ingredient =
	models.Ingredient || model<IIngredient>("Ingredient", IngredientSchema);
