import { Schema, model, models, Document, Types } from "mongoose";

export interface IRating extends Document {
	userId: Types.ObjectId;
	rating: number;
}

const RatingSchema = new Schema<IRating>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
	},
	{ timestamps: true }
);

export const Rating = models.Rating || model<IRating>("Rating", RatingSchema);
