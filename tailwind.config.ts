import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				Green: "#1AEB54",
			},
			fontFamily: {
				display: ["var(--font-roboto)"],
				menu: ["var(--font-poppins)"],
				title: ["var(--font-raleway)"],
			},
		},
	},
	plugins: [],
} satisfies Config;
