import AdminNavbar from "@/app/components/AdminNavbar";

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
