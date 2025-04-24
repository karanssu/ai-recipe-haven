import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Matches all domains - risky, use only if needed
			},
		],
	},
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: "https",
	// 			hostname: "lh3.googleusercontent.com",
	// 			port: "",
	// 			pathname: "/**",
	// 			search: "",
	// 		},
	// 		{
	// 			protocol: "https",
	// 			hostname: "img.freepik.com",
	// 			port: "",
	// 			pathname: "/**",
	// 			search: "",
	// 		},
	// 		{
	// 			protocol: "https",
	// 			hostname: "img.spoonacular.com",
	// 			port: "",
	// 			pathname: "/**",
	// 			search: "",
	// 		},
	// 	],
	// },
};

export default nextConfig;
