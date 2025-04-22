import { SessionUser } from "@/app/lib/definitions";
import { deleteSession } from "@/app/lib/session";
import { signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

interface NavbarProps {
	user: SessionUser | null;
}

const Navbar = async ({ user }: NavbarProps) => {
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
			<Link href="/recipe">
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
						<span>Hello, {user.name}</span>
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

			<MobileMenu user={user} />
		</nav>
	);
};

export default Navbar;
