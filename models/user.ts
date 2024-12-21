import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImage: { type: String, required: false },
		role: { type: String, required: true, default: "user" },
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
