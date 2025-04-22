import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<div className="bg-white font-sans">
			<header className="relative h-[80vh]">
				<Image
					src="/hero-food.jpg"
					alt="Delicious dishes image"
					fill
					priority
					className="object-center object-cover"
				/>
				<div className="absolute inset-0 bg-black opacity-70"></div>
				<div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-title">
						Welcome to AI Recipe Haven
					</h1>
					<p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 font-display">
						Discover new and exciting recipes powered by AI. Personalize your
						meal planning, explore endless culinary delights, and enjoy a
						smarter cooking experience.
					</p>
					<Link
						href="/recipe"
						className="px-8 py-4 w-40 bg-primaryBgHover text-white font-semibold text-lg rounded-full shadow-lg hover:bg-primaryBgHover transition font-menu"
					>
						Explore
					</Link>
				</div>
			</header>

			<section className="py-16 bg-gray-100">
				<div className="container mx-auto px-6 font-display">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-title">
						Featured Recipes
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Recipe Card 1 */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="relative w-full h-72">
								<Image
									src="/recipe1.jpg"
									alt="Spicy Ramen"
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-xl font-semibold text-gray-800">
									Spicy Ramen
								</h3>
								<p className="mt-2 text-gray-600">
									A fiery twist on classic ramen with bold flavors and fresh
									ingredients.
								</p>
							</div>
						</div>
						{/* Recipe Card 2 */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="relative w-full h-72">
								<Image
									src="/recipe2.jpg"
									alt="Vegan Salad Bowl"
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-xl font-semibold text-gray-800">
									Vegan Salad Bowl
								</h3>
								<p className="mt-2 text-gray-600">
									A vibrant and healthy mix of greens, fruits, and superfoods.
								</p>
							</div>
						</div>
						{/* Recipe Card 3 */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="relative w-full h-72">
								<Image
									src="/recipe3.jpg"
									alt="Classic Pasta"
									fill
									className="object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-xl font-semibold text-gray-800">
									Classic Pasta
								</h3>
								<p className="mt-2 text-gray-600">
									An Italian classic made with fresh ingredients and a hint of
									basil.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-16">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-title">
						What Our Users Say
					</h2>
					<div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
						<div className="bg-white p-6 rounded-xl shadow-lg flex-1">
							<p className="text-gray-600 italic">
								&quot;The AI recommendations are spot-on! I&rsquo;ve discovered
								so many new recipes.&quot;
							</p>
							<p className="mt-4 text-gray-800 font-semibold">- Alex D.</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-lg flex-1">
							<p className="text-gray-600 italic">
								&quot;Meal planning has never been easier. I love how
								personalized everything is.&quot;
							</p>
							<p className="mt-4 text-gray-800 font-semibold">- Jamie L.</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-lg flex-1">
							<p className="text-gray-600 italic">
								&quot;A must-try for anyone looking to spice up their cooking
								routine!&quot;
							</p>
							<p className="mt-4 text-gray-800 font-semibold">- Morgan S.</p>
						</div>
					</div>
				</div>
			</section>

			<Link
				href="/recipe"
				className="fixed bottom-8 right-8 px-6 py-3 bg-primaryBgHover text-white font-semibold font-menu text-lg rounded-full shadow-lg hover:bg-primaryBgHover transition"
			>
				Explore
			</Link>
		</div>
	);
}
