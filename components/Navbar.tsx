import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	return (
		<nav className="bg-green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-5 text-sm">
				<Link href="/admin">Admin Home</Link>
				<Link href="/admin/dashboard">Admin Dashboard</Link>
				<Link href="/admin/signup">Admin Signup</Link>
				<Link href="/admin/login">Admin Login</Link>
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/recipe">All Recipes</Link>
				<Link href="/recipe/new">Create Recipes</Link>
				<Link href="/mealplan">Meal Plan</Link>
				<Link href="/profile">Profile</Link>
				<Link href="/signup">Sign up</Link>
				<Link href="/login">Log in</Link>
			</div>
		</nav>
	);
};

export default Navbar;
