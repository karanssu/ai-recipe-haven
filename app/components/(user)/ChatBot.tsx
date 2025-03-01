import { ChatBotIcon as ChatBotIcon } from "hugeicons-react";

const ChatBot = () => {
	return (
		<div className="fixed bottom-8 right-8 w-14 h-14 bg-primaryBg text-white font-semibold font-menu text-lg rounded-full shadow-lg hover:bg-primaryBgHover transition cursor-pointer flex items-center justify-center">
			<ChatBotIcon className="text-primaryText w-8 h-8" />
		</div>
	);
};

export default ChatBot;
