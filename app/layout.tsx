import type { Metadata } from "next";
import { Roboto, Poppins, Raleway } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "900"],
});

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
	title: "AI Recipe Haven",
	description: "AI Recipe Haven is a recipe sharing platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.variable} ${poppins.variable} ${raleway.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
