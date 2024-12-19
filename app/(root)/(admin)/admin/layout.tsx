import AdminNavbar from "@/components/AdminNavbar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<AdminNavbar />
			{children}
		</div>
	);
}
