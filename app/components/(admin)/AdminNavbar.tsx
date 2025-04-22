import { SessionUser } from "@/app/lib/definitions";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import AdminMobileMenu from "./AdminMobileMenu";

interface AdminNavbarProps {
	user: SessionUser | null;
}

const AdminNavbar = async ({ user }: AdminNavbarProps) => {
	return (
		<nav
			className="
      fixed top-0 left-0 right-0 z-50
      bg-primaryBg
      container mx-auto px-8 md:px-16
      flex items-center justify-between
      shadow-md
    "
		>
			<Link href="/admin/home">
				<div className="w-16 h-16 md:w-20 md:h-20 relative">
					<Image
						src="/logo.png"
						alt="logo"
						priority
						fill
						sizes="(max-width: 768px) 40px, 80px"
						className="object-contain"
					/>
				</div>
			</Link>

			{/* Desktop Links */}
			<div className="hidden md:flex space-x-6 text-sm">
				{user?._id ? (
					<>
						<div>Hello, {user?.name as string}</div>
						<Link href="/admin/recipe/new">Create Recipe</Link>
						<Link href="/admin/recipe/spoonacular/new">Fetch Recipes</Link>
						<Link href="/admin/home">Manage Recipes</Link>
						<Link href="/admin/recipe/review">Manage Reviews</Link>
						<Link href="/admin/user">Manage Users</Link>
						{user?.role === "superadmin" && (
							<Link href="/admin/signup">Add Admin</Link>
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

			<AdminMobileMenu user={user} />
		</nav>
	);
};

export default AdminNavbar;
