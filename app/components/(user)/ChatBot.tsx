"use client";

import { useState } from "react";
import { ChatBotIcon } from "hugeicons-react";

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
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						{/* Chat Content */}
						<div className="p-4">
							<h2 className="text-xl font-bold">Chat</h2>
							<p>Welcome to our chat support!</p>
							{/* Additional chat UI goes here */}
						</div>
					</div>
				</div>
			)}

			{/* Chat Window for Medium & Large Screens (popover above chat button) */}
			{isOpen && (
				<div className="hidden md:block fixed bottom-24 right-8 z-50 w-80 h-96 bg-white rounded-lg shadow-lg">
					{/* Close Button */}
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					{/* Chat Content */}
					<div className="p-4">
						<h2 className="text-xl font-bold">Chat</h2>
						<p>Welcome to our chat support!</p>
						{/* Additional chat UI goes here */}
					</div>
				</div>
			)}
		</>
	);
};

export default ChatBot;
