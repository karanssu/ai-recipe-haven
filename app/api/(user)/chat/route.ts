import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/app/lib/mongodb";
import { ChatMessage } from "@/app/models/chatmessage.model";

export async function POST(req: NextRequest) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	await connectMongoDB();
	const { chatId, text } = await req.json();

	if (!chatId || !text) {
		return NextResponse.json(
			{ error: "Missing or invalid fields" },
			{ status: 400 }
		);
	}

	const userMessage = await ChatMessage.create({ chatId, text, type: "user" });

	const responseMessageText = await generateAIResponse(text);

	const responseMessage = await ChatMessage.create({
		chatId,
		text: responseMessageText,
		type: "system",
	});

	return NextResponse.json({ userMessage, responseMessage }, { status: 201 });
}

export async function GET(req: NextRequest) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

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

const generateAIResponse = async (text: string): Promise<string> => {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY is not set.");
	}

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: text }],
			max_tokens: 150,
			temperature: 0.7,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`OpenAI API error: ${errorText}`);
	}

	const data = await response.json();
	const generatedText = data.choices?.[0]?.message?.content?.trim() || "";
	return generatedText;
};
