import { verifySession } from "@/app/lib/dal";
import { SessionUser } from "@/app/lib/definitions";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const AdminNavbar = async () => {
	let user: SessionUser | null = null;
	const session = await verifySession();
	if (session) {
		user = { ...session, _id: session.userId };
	}

	return (
		<nav className="px-16 flex justify-between items-center">
			<div>
				<Link href="/admin">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				{user && user?._id ? (
					<>
						<div>
							<Link href="/admin">Hello, {user?.name as string}</Link>
						</div>
						<Link href="/admin/dashboard">Dashboard</Link>
						<Link href="/admin/user">Manage Users</Link>
						{user?.role === "superadmin" && (
							<Link href="/admin/signup">Admin Signup</Link>
						)}

						<form
							action={async () => {
								"use server";

								await deleteSession();
								await signOut({ redirectTo: "/" });
							}}
						>
							<button
								className="font-menu font-semibold text-primaryText bg-transparent hover:bg-transparent rounded-none"
								type="submit"
							>
								Logout
							</button>
						</form>
					</>
				) : (
					<>
						<Link href="/admin/login">Admin Login</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default AdminNavbar;
