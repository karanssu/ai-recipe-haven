import Image from "next/image";

const Page = () => {
	return (
		<>
			<div className="font-title font-semibold text-center mt-10 text-3xl">
				<div>Fetching New Recipes...</div>
				<div>
					<Image
						src="/loading.gif"
						unoptimized
						width={50}
						height={50}
						alt="Loading..."
						className="mx-auto mt-4"
					/>
				</div>
			</div>
		</>
	);
};

export default Page;
