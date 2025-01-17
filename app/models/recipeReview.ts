import mongoose, { Schema } from "mongoose";
import { RecipeReview } from "../lib/definitions";

const ReviewSchema = new Schema<RecipeReview>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	review: { type: String, required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	date: { type: Date, default: Date.now },
});

const Review = mongoose.model<RecipeReview>("Review", ReviewSchema);

export default Review;
