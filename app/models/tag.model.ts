import { Schema, model, models, Document } from "mongoose";

export interface ITag extends Document {
	name: string;
}

const TagSchema = new Schema<ITag>(
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

TagSchema.index({ name: 1 });

export const Tag = models.Tag || model<ITag>("Tag", TagSchema);
