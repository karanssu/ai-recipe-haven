import AdminNavbar from "@/app/components/(admin)/AdminNavbar";
import { verifySession } from "@/app/lib/dal";
import { SessionUser } from "@/app/lib/definitions";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let user: SessionUser | null = null;
	const session = await verifySession();
	if (session) {
		user = { ...session, _id: session.userId };
	}

	return (
		<div className="pt-20">
			<AdminNavbar user={user} />
			{children}
		</div>
	);
}
