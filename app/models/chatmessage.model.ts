import { Schema, model, models, Document } from "mongoose";

export interface IChatMessage extends Document {
	chatId: string;
	text: string;
	type: "user" | "system";
}

const ChatMessageSchema = new Schema<IChatMessage>(
	{
		chatId: { type: String, required: true },
		text: { type: String, required: true },
		type: { type: String, enum: ["user", "system"], required: true },
	},
	{ timestamps: true }
);

export const ChatMessage =
	models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);
