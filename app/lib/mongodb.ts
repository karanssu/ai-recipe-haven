import { connect } from "mongoose";

export const connectMongoDB = async () => {
	try {
		const { connection } = await connect(process.env.MONGODB_URI as string);
		if (connection.readyState === 1) {
			console.log("Connected to MongoDB");
			return Promise.resolve(true);
		}

		console.log("Connected to MongoDB");
	} catch (error) {
		console.error(error);
		console.error("Error connecting to MongoDB", error);
		return Promise.reject(error);
	}
};
export const connectDB = async () => {};
