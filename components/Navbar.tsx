import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
	return (
		<nav className="bg-green px-16 py-2 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/">
					<Image src="/logo.png" alt="logo" width={60} height={60} />
				</Link>
			</div>

			<div className="flex space-x-10 text-lg">
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/recipe">All Recipes</Link>
				<Link href="/mealplan">Meal Plan</Link>
				<Link href="/profile">Profile</Link>
				<Link href="/signup">Sign up</Link>
				<Link href="/login">Log in</Link>
			</div>
		</nav>
	);
};

export default Navbar;
