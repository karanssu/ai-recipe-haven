import { verifySession } from "@/app/lib/dal";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
	const session = await verifySession();

	return (
		<nav className="px-16 flex justify-between items-center">
			<div>
				<Link href="/dashboard">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				{session && session?.userId ? (
					<>
						<div>
							<Link href="/profile">Hello, {session?.name as string}</Link>
						</div>
						<Link href="/recipe">All Recipes</Link>
						<Link href="/recipe/new">Create Recipes</Link>
						<Link href="/mealplan">Meal Plan</Link>
						<Link href="/profile">Profile</Link>
						<form
							action={async () => {
								"use server";

								await deleteSession();
								await signOut({ redirectTo: "/" });
							}}
						>
							<button
								className="font-menu font-semibold text-primaryText hover:bg-transparent"
								type="submit"
							>
								Logout
							</button>
						</form>
					</>
				) : (
					<>
						<Link href="/recipe">All Recipes</Link>
						<Link href="/login">Log in</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
