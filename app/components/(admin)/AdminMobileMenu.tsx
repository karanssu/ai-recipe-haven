"use client";

import { useState } from "react";
import Link from "next/link";
import { SessionUser } from "@/app/lib/definitions";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import { Menu01Icon as MenuIcon } from "hugeicons-react";
import { logout } from "@/app/actions/actions";

interface AdminMobileMenuProps {
	user: SessionUser | null;
}

export default function AdminMobileMenu({ user }: AdminMobileMenuProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Toggle button */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="md:hidden p-2 rounded-md focus:outline-none"
			>
				{open ? (
					<CloseIcon className="w-6 h-6 text-primaryText" />
				) : (
					<MenuIcon className="w-6 h-6 text-primaryText" />
				)}
			</button>

			{/* Overlay */}
			<div
				className={`
          fixed inset-0 bg-black bg-opacity-50 z-40
          transition-opacity duration-200
          ${
						open
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}
        `}
				onClick={() => setOpen(false)}
			/>

			{/* Side drawer */}
			<aside
				className={`
          fixed top-0 right-0 h-full w-52 bg-primaryBg z-50
          transform transition-transform duration-200
          ${open ? "translate-x-1" : "translate-x-full"}
        `}
			>
				<nav className="mt-10 flex flex-col space-y-5 p-4 text-primaryText">
					{user?._id ? (
						<>
							<span className="font-semibold">
								Hello, {user?.name as string}
							</span>

							<Link href="/admin/recipe/new" onClick={() => setOpen(false)}>
								Create Recipe
							</Link>
							<Link
								href="/admin/recipe/spoonacular/new"
								onClick={() => setOpen(false)}
							>
								Fetch Recipes
							</Link>
							<Link href="/admin/home" onClick={() => setOpen(false)}>
								Manage Recipes
							</Link>
							<Link href="/admin/recipe/review" onClick={() => setOpen(false)}>
								Manage Reviews
							</Link>
							<Link href="/admin/user" onClick={() => setOpen(false)}>
								Manage Users
							</Link>

							{user?.role === "superadmin" && (
								<Link href="/admin/signup" onClick={() => setOpen(false)}>
									Add Admin
								</Link>
							)}

							<form action={logout}>
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
							<Link href="/admin/login" onClick={() => setOpen(false)}>
								Admin Login
							</Link>
						</>
					)}
				</nav>
			</aside>
		</>
	);
}
