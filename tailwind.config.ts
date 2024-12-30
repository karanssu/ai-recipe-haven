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
				primaryBg: "#1AEB54",
				primaryBgHover: "#22c55e",
				primaryText: "#000000",
				grayText: "#9ca3af",
				darkGrayText: "#4b5563",
				redText: "#ef4444",
				darkRedText: "#dc2626",
				blueText: "#3b82f6",
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
