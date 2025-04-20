import AdminNavbar from "@/app/components/(admin)/AdminNavbar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="pb-20 md:pb-0">
			<AdminNavbar />
			{children}
		</div>
	);
}
