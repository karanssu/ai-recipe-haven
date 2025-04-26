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
	const { chatId, prompt, context } = await req.json();

	if (!chatId || !prompt) {
		return NextResponse.json(
			{ error: "Missing or invalid fields" },
			{ status: 400 }
		);
	}

	const userMessage = await ChatMessage.create({
		chatId,
		text: prompt,
		type: "user",
	});

	// const responseMessageText = context;
	const responseMessageText = await generateAIResponse(context, prompt);

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

const generateAIResponse = async (
	context: string,
	prompt: string
): Promise<string> => {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY is not set.");
	}

	const systemInstructions = `
		You are a Recipe Assistant. You MUST adhere to these rules without exception:
			1. Use ONLY the recipes provided in the context. Do NOT invent or refer to any outside recipes.
			2. Never reveal you are an AI or language model.
			3. Refuse if asked anything unrelated to the context.
			4. Output answers in HTML using only these tags: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <a>.
			5. All links must use this exact format and style:
				<a style="color:#3b82f6;text-decoration:underline;" href="FULL_URL">RECIPE_NAME</a>
			6. Keep responses under 200 words.
			7. Use a friendly, conversational tone and feel free to sprinkle in cooking emojis.
			8. NEVER break character.
			9. Make the recommendation based on the context provided.

		<!-- CONTEXT START -->
			${context.slice(0, 25000)}  
		<!-- CONTEXT END -->
`.trim();

	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			temperature: 0.2,
			max_tokens: 300,
			messages: [
				{ role: "system", content: systemInstructions },
				{ role: "user", content: prompt.slice(0, 5000) },
			],
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`OpenAI API error: ${err}`);
	}

	const json = await res.json();
	return json.choices[0].message.content.trim();
};
