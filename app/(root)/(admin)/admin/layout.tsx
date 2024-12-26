import AdminNavbar from "@/app/components/(admin)/AdminNavbar";

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
