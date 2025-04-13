import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { ChatMessage } from "@/app/models/chatmessage.model";

export async function POST(req: NextRequest) {
	await connectMongoDB();
	const { chatId, text } = await req.json();

	if (!chatId || !text) {
		return NextResponse.json(
			{ error: "Missing or invalid fields" },
			{ status: 400 }
		);
	}

	await ChatMessage.create({ chatId, text, type: "user" });

	const responseMessage = `ChatBot Response: You said, "${text}"`;

	await ChatMessage.create({
		chatId,
		text: responseMessage,
		type: "system",
	});

	return NextResponse.json({ message: responseMessage }, { status: 201 });
}

export async function GET(req: NextRequest) {
	await connectMongoDB();
	const { searchParams } = new URL(req.url);
	const chatId = searchParams.get("chatId");

	if (!chatId) {
		return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
	}

	const messages = await ChatMessage.find({ chatId })
		.sort({ createdAt: 1 })
		.lean();

	return NextResponse.json({ messages });
}
