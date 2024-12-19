import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	return (
		<nav className="bg-Green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				<div className="">
					<Link href="/profile">Hello, {"Test User"}</Link>
				</div>
				<Link href="/admin">Ad Home</Link>
				<Link href="/admin/dashboard">Ad Dashboard</Link>
				<Link href="/admin/signup">Ad Signup</Link>
				<Link href="/admin/login">Ad Login</Link>
				<Link href="/admin/logout">Ad Logout</Link>
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/recipe">All Recipes</Link>
				<Link href="/recipe/new">Create Recipes</Link>
				<Link href="/mealplan">Meal Plan</Link>
				<Link href="/profile">Profile</Link>
				<Link href="/signup">Sign up</Link>
				<Link href="/login">Log in</Link>
				<Link href="/logout">Logout</Link>
			</div>
		</nav>
	);
};

export default Navbar;
