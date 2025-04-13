import ChatBot from "@/app/components/(user)/ChatBot";
import Navbar from "@/app/components/(user)/Navbar";
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
		<div>
			<Navbar />
			{user && <ChatBot userId={user._id} />}
			{children}
		</div>
	);
}
