import Link from "next/link";

const Page = () => {
	return (
		<>
			<div className="text-4xl text-center mt-10 font-semibold">
				All Recipes
			</div>

			<ul className="mt-10 text-center text-xl cursor-pointer">
				<li>
					<Link href={`/recipe/1`}>Recipe 1</Link>
				</li>
				<li>
					<Link href={`/recipe/2`}>Recipe 2</Link>
				</li>
				<li>
					<Link href={`/recipe/3`}>Recipe 3</Link>
				</li>
				<li>
					<Link href={`/recipe/4`}>Recipe 4</Link>
				</li>
				<li>
					<Link href={`/recipe/5`}>Recipe 5</Link>
				</li>
			</ul>
		</>
	);
};

export default Page;
