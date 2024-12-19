import Image from "next/image";
import Link from "next/link";

type User = {
	_id: string;
	name: string;
	username: string;
	email: string;
	password: string;
	profileImage: string;
	role: string;
};

const AdminNavbar = () => {
	const user: User = {
		_id: "1",
		name: "admin",
		username: "admin",
		email: "admin@gmail.com",
		password: "password",
		profileImage: "profileImage",
		role: "admin",
	};

	console.log(user);

	return (
		<nav className="bg-Green px-16 text-black font-bold flex justify-between items-center">
			<div>
				<Link href="/admin">
					<Image src="/logo.png" alt="logo" width={80} height={80} />
				</Link>
			</div>

			<div className="flex space-x-4 text-sm">
				<div className="">
					<Link href="/admin">Hello, {user.name}</Link>
				</div>
				<Link href="/admin">Admin Home</Link>
				<Link href="/admin/dashboard">Admin Dashboard</Link>
				<Link href="/admin/signup">Admin Signup</Link>
				<Link href="/admin/login">Admin Login</Link>
				<Link href="/admin/logout">Admin Logout</Link>
			</div>
		</nav>
	);
};

export default AdminNavbar;
