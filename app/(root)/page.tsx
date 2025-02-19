import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-semibold">
			<div className="max-w-2xl text-center bg-white p-8 rounded-2xl shadow-lg">
				<h1 className="text-4xl font-bold text-primaryText mb-4 font-title">
					Welcome to AI Recipe Haven
				</h1>
				<p className="text-darkGrayText text-lg mb-6 font-display">
					Discover new and exciting recipes with the help of AI. Search for
					meals based on ingredients, dietary preferences, and cuisine types.
					Engage with an AI chef for personalized recommendations.
				</p>
				<Link
					href={"/recipe"}
					className="px-6 py-3 text-lg font-semibold text-primaryText bg-primaryBg rounded-xl hover:bg-primaryBgHover transition font-menu"
				>
					Explore
				</Link>
			</div>
		</div>
	);
}
