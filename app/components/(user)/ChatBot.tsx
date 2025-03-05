"use client";

import { useState } from "react";
import { ChatBotIcon } from "hugeicons-react";
import { PlayIcon as SendIcon } from "hugeicons-react";
import { ArrowDown01Icon as CollapseIcon } from "hugeicons-react";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import Image from "next/image";

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toogleIsOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			{/* Chat Button */}
			<div
				onClick={() => toogleIsOpen()}
				className="fixed bottom-8 right-8 w-14 h-14 bg-primaryBg text-white font-semibold font-menu text-lg rounded-full shadow-lg hover:bg-primaryBgHover transition cursor-pointer flex items-center justify-center"
			>
				<ChatBotIcon className="text-primaryText w-8 h-8" />
			</div>

			{/* Chat Window for Small Screens (full-screen modal) */}
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
						{/* Chat Body */}
						<div className="h-[85%] p-4 overflow-y-auto">
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
							<div className="items-center justify-center overflow-y-auto h-[85%]">
								{/* Additional chat messages can be rendered here */}
							</div>
						</div>
						{/* Chat Input Area */}
						<div className="h-[15%] p-4 text-sm flex items-center">
							<input
								type="text"
								placeholder="Type your message..."
								className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
							/>
							<button className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2">
								<SendIcon />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Chat Window for Medium & Large Screens (popover above chat button) */}
			{isOpen && (
				<div className="hidden md:flex fixed bottom-24 right-8 z-50 w-80 h-96 bg-gray-50 rounded-lg shadow-lg flex-col">
					{/* Close Button */}
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-2 right-2 mt-2 text-gray-500 hover:text-gray-700 z-10 bg-transparent hover:bg-transparent"
					>
						<CollapseIcon className="stroke-2" />
					</button>
					{/* Chat Body */}
					<div className="h-[85%] p-4 overflow-y-auto">
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
						<div className="items-center justify-center overflow-y-auto h-[85%]">
							{/* Additional chat messages can be rendered here */}
						</div>
					</div>
					{/* Chat Input Area */}
					<div className="h-[15%] p-4 text-sm flex items-center">
						<input
							type="text"
							placeholder="Type your message..."
							className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 mr-2 focus:outline-none focus:border-primaryBg font-display"
						/>
						<button className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-2">
							<SendIcon />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatBot;
