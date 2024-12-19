import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

// type User = {
// 	_id: string;
// 	name: string;
// 	username: string;
// 	email: string;
// 	password: string;
// 	googleId: string;
// 	profileImage: string;
// 	role: string;
// };

const Navbar = async () => {
	const session = await auth();

	return (
		<nav className="bg-Green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/dashboard">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				{session && session?.user ? (
					<>
						<div className="">
							<Link href="/profile">Hello, {session?.user?.name}</Link>
						</div>
						<Link href="/recipe/new">Create Recipes</Link>
						<Link href="/mealplan">Meal Plan</Link>
						<Link href="/profile">Profile</Link>
						<form
							action={async () => {
								"use server";

								await signOut({ redirectTo: "/" });
							}}
						>
							<button type="submit">Logout</button>
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
