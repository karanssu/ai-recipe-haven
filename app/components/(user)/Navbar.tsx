import { verifySession } from "@/app/lib/dal";
import { SessionUser } from "@/app/lib/definitions";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
	let user: SessionUser | null = null;
	const session = await verifySession();
	if (session) {
		user = { ...session, _id: session.userId };
	}

	return (
		<nav
			className="
     fixed bottom-0 left-0 right-0 bg-primaryBg md:relative md:bg-primaryBg 
     container mx-auto px-2 md:px-16 
     flex justify-center md:justify-between items-center 
     z-50 shadow-lg md:shadow-none
   "
		>
			<div>
				<Link href="/recipe">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex ml-5 md:ml-0 space-x-5 text-xs md:text-sm">
				{user && user?._id ? (
					<>
						<div>Hello, {user?.name as string}</div>
						<Link href="/recipe">All Recipes</Link>
						<Link href="/recipe/new">Create Recipe</Link>
						<Link href="/recipe/my">My Recipes</Link>
						<Link href="/profile">Profile</Link>
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
						<Link href="/recipe">All Recipes</Link>
						<Link href="/login">Log in</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
