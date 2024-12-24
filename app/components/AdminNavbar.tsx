import { verifySession } from "@/app/lib/dal";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const AdminNavbar = async () => {
	const session = await verifySession();

	return (
		<nav className="bg-Green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/admin">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				{session && session?.userId ? (
					<>
						<div className="">
							<Link href="/admin">Hello, {session?.userId as string}</Link>
						</div>
						<Link href="/admin">Admin Home</Link>
						<Link href="/admin/dashboard">Admin Dashboard</Link>
						{session?.role === "superadmin" && (
							<Link href="/admin/signup">Admin Signup</Link>
						)}

						<form
							action={async () => {
								"use server";

								await deleteSession();
								await signOut({ redirectTo: "/" });
							}}
						>
							<button type="submit">Admin Logout</button>
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
