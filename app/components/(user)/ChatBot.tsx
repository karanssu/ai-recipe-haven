"use client";

import { useState, useRef, useEffect } from "react";
import { ChatBotIcon } from "hugeicons-react";
import { PlayIcon as SendIcon } from "hugeicons-react";
import { ArrowDown01Icon as CollapseIcon } from "hugeicons-react";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import Image from "next/image";

interface IMessage {
	id: string;
	type: "system" | "user";
	text: string;
}

const ChatBody = ({
	messages,
	chatBodyRef,
}: {
	messages: IMessage[];
	chatBodyRef: React.RefObject<HTMLDivElement | null>;
}) => {
	useEffect(() => {
		if (chatBodyRef.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	});

	return (
		<div
			ref={chatBodyRef}
			className="flex flex-col gap-2 overflow-y-scroll mt-4 h-full"
		>
			{messages.map((msg: IMessage) => (
				<div
					key={msg.id}
					className={`max-w-[80%] p-2 rounded-md ${
						msg.type === "system"
							? "bg-gray-200 self-start"
							: "bg-green-300 self-end"
					}`}
				>
					<p className="text-sm text-gray-800 break-words text-left pl-2">
						{msg.text}
					</p>
				</div>
			))}
		</div>
	);
};

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleIsOpen = () => setIsOpen(!isOpen);

	// Maintain messages state (pre-populate with initial sample messages if needed)
	const [messages, setMessages] = useState<IMessage[]>([
		{
			id: "1",
			type: "system",
			text: "Hello, how can I help you today?",
		},
	]);

	// Controlled input value for the chat message
	const [inputMessage, setInputMessage] = useState("");

	// Use a ref to the chat body for scrolling
	const chatBodyRef = useRef<HTMLDivElement>(null);

	// Function to send the message and update state, scrolling to the bottom after updating.
	const handleMessageSend = async () => {
		// Do not send if input is empty
		if (!inputMessage.trim()) return;

		// Create user message object
		const newUserMessage: IMessage = {
			id: Date.now().toString(),
			type: "user",
			text: inputMessage,
		};

		// Clear the input field immediately
		setInputMessage("");

		// Append the user message to messages state
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);

		try {
			// Send the message to the server; adjust endpoint as needed.
			const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: newUserMessage.text }),
			});

			if (!res.ok) {
				throw new Error("Failed to get a response from server");
			}

			const data = await res.json();

			// Create system response message (assuming the server response includes a "message" field)
			const newSystemMessage: IMessage = {
				id: Date.now().toString() + "-sys",
				type: "system",
				text: data.message || "Sorry, something went wrong.",
			};

			// Append system message to messages state
			setMessages((prevMessages) => [...prevMessages, newSystemMessage]);
		} catch (error) {
			// Append error message in case of failure
			const errorMessage: IMessage = {
				id: Date.now().toString() + "-err",
				type: "system",
				text: "Error: Could not send your message. Please try again.",
			};
			console.error("Error sending message:", error);
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			// Scroll the chat body to the bottom
			setTimeout(() => {
				if (chatBodyRef.current) {
					chatBodyRef.current.scrollTo({
						top: chatBodyRef.current.scrollHeight,
						behavior: "smooth",
					});
				}
			}, 100);
		}
	};

	useEffect(() => {
		if (chatBodyRef.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<>
			{/* Chat Button */}
			<div
				onClick={() => toggleIsOpen()}
				className="fixed bottom-8 right-8 w-14 h-14 bg-primaryBg text-white font-semibold font-menu text-lg rounded-full shadow-lg hover:bg-primaryBgHover transition cursor-pointer flex items-center justify-center z-50"
			>
				<ChatBotIcon className="text-primaryText w-8 h-8" />
			</div>

			{/* Chat Modal for Small Screens */}
			{isOpen && (
				<div className="fixed inset-0 z-50 md:hidden bg-black bg-opacity-50 flex items-center justify-center">
					<div className="relative w-full h-full bg-white">
						{/* Close Button */}
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-3 text-gray-400 hover:text-gray-500 z-10 bg-transparent hover:bg-transparent"
						>
							<CloseIcon className="stroke-2" />
						</button>
						{/* Chat Header */}
						<div className="h-[85%] px-4 pt-4 overflow-y-auto">
							<div className="flex border-b-2 pb-2 justify-center items-center">
								<Image
									className="mr-2"
									src="/chatbot.png"
									width={30}
									height={30}
									alt="AI Avatar"
								/>
								<h2 className="text-xl font-bold">Chat with AI</h2>
							</div>
							{/* Chat Body */}
							<div className="h-full">
								<ChatBody messages={messages} chatBodyRef={chatBodyRef} />
							</div>
						</div>
						{/* Chat Input Area */}
						<div className="h-[15%] p-4 text-sm flex items-center">
							<input
								type="text"
								placeholder="Type your message..."
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
							/>
							<button
								className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2"
								onClick={handleMessageSend}
							>
								<SendIcon />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Chat Modal for Medium & Large Screens */}
			{isOpen && (
				<div className="hidden md:flex fixed bottom-24 right-8 z-50 w-80 h-96 bg-gray-50 rounded-lg shadow-lg flex-col">
					{/* Close Button */}
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-2 right-2 mt-2 text-gray-400 hover:text-gray-500 z-10 bg-transparent hover:bg-transparent"
					>
						<CollapseIcon className="stroke-2" />
					</button>
					{/* Chat Header */}
					<div className="h-[85%] px-4 pt-4 overflow-y-auto">
						<div className="flex border-b-2 pb-2 justify-center items-center">
							<Image
								className="mr-2"
								src="/chatbot.png"
								width={30}
								height={30}
								alt="AI Avatar"
							/>
							<h2 className="text-xl font-bold">Chat with AI</h2>
						</div>
						{/* Chat Body */}
						<div className="h-[80%]">
							<ChatBody messages={messages} chatBodyRef={chatBodyRef} />
						</div>
					</div>
					{/* Chat Input Area */}
					<div className="h-[15%] p-4 text-sm flex items-center">
						<input
							type="text"
							placeholder="Type your message..."
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleMessageSend();
								}
							}}
							className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
						/>
						<button
							className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2"
							onClick={handleMessageSend}
						>
							<SendIcon />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatBot;
