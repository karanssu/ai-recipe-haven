import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const AdminNavbar = async () => {
	const session = await auth();

	return (
		<nav className="bg-Green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/admin">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				{session && session?.user ? (
					<>
						<div className="">
							<Link href="/admin">Hello, {session?.user?.name}</Link>
						</div>
						<Link href="/admin">Admin Home</Link>
						<Link href="/admin/dashboard">Admin Dashboard</Link>
						<Link href="/admin/signup">Admin Signup</Link>
						<form
							action={async () => {
								"use server";

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
