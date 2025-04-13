import { NextResponse } from "next/server";
export async function POST(req: Request) {
	try {
		const { message } = await req.json();
		const responseMessage = `ChatBot Response: You said, "${message}"`;
		return NextResponse.json({ message: responseMessage });
	} catch (error) {
		console.error("Error in chat API:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
