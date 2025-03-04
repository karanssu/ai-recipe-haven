"use client";

import { useState } from "react";
import { ChatBotIcon } from "hugeicons-react";
import { Forward01Icon as SendIcon } from "hugeicons-react";
import { ArrowDown01Icon as CollapseIcon } from "hugeicons-react";

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
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10 bg-transparent hover:bg-transparent"
						>
							<CollapseIcon />
						</button>
						{/* Chat Content */}
						<div className="p-4">
							<h2 className="text-xl font-bold">Chat with AI</h2>
							{/* Additional chat UI goes here */}
						</div>
					</div>
				</div>
			)}

			{/* Chat Window for Medium & Large Screens (popover above chat button) */}
			{isOpen && (
				<div className="hidden md:block fixed bottom-24 right-8 z-50 w-80 h-96 bg-gray-50 rounded-lg shadow-lg flex flex-col">
					{/* Close Button */}
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-2 right-2 mt-2 text-gray-500 hover:text-gray-700 z-10 bg-transparent hover:bg-transparent"
					>
						<CollapseIcon />
					</button>
					{/* Chat Content */}
					<div className="flex-1 p-4 overflow-y-auto">
						<h2 className="text-xl font-bold">Chat with AI</h2>
						{/* Additional chat messages can be rendered here */}
					</div>
					{/* Chat Input Area */}
					<div className="border-t p-4 text-sm">
						<div className="flex">
							<input
								type="text"
								placeholder="Type your message..."
								className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:border-primaryBg"
							/>
							<button className="bg-primaryBg hover:bg-primaryBgHover text-white rounded-full px-2 py-1">
								<SendIcon />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatBot;
