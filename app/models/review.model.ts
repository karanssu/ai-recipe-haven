import { Schema, model, models, Document, Types } from "mongoose";

export interface IReview extends Document {
	recipeId: Types.ObjectId;
	userId: Types.ObjectId;
	review: string;
	likes: { userId: Types.ObjectId }[];
	date: Date;
}

const ReviewSchema = new Schema<IReview>(
	{
		recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		review: { type: String, required: true },
		likes: [
			{
				userId: { type: Schema.Types.ObjectId, ref: "User" },
			},
		],
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export const Review = models.Review || model<IReview>("Review", ReviewSchema);
