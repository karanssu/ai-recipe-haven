"use client";

import { useState } from "react";
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

const ChatBody = ({ messages }: { messages: IMessage[] }) => {
	return (
		<div className="flex flex-col gap-2 overflow-y-scroll mt-4 h-[100%]">
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
	const messages: IMessage[] = [
		{
			id: "1",
			type: "system",
			text: "Hello, how can I help you today?Hello, how can I help you todayHello, how can I help you today??",
		},
		{
			id: "2",
			type: "user",
			text: "askldfjaslkdjflaksdjflkasdjflkasdjflkasdjflaskdjflaskdfjlaksdjflasdkfjasldkfj",
		},
	];

	const handleMessageSend = () => {
		// get message from input field (phone or desktop chat)
		// clear input field and store
		// update messages state with new message
		// send message to server and get response
		// update messages state with response message
		// scroll to bottom of chat body
		// if failed anything, show return error message as response and reset input field
	};

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
							<div className="h-[100%]">
								<ChatBody messages={messages} />
							</div>
						</div>
						{/* Chat Input Area */}
						<div className="h-[15%] p-4 text-sm flex items-center">
							<input
								type="text"
								placeholder="Type your message..."
								className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
							/>
							<button
								className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2"
								onClick={() => handleMessageSend()}
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
							<ChatBody messages={messages} />
						</div>
					</div>
					{/* Chat Input Area */}
					<div className="h-[15%] p-4 text-sm flex items-center">
						<input
							type="text"
							placeholder="Type your message..."
							className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
						/>
						<button
							className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2"
							onClick={() => handleMessageSend()}
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
