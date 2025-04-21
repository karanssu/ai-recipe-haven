import { NextRequest, NextResponse } from "next/server";
import { decrypt, updateSession } from "@/app/lib/session";
import { cookies } from "next/headers";

const authRoutes = ["/login", "/signup", "/admin/login"];
const adminRoutes = [
	"/admin",
	"/admin/user",
	"/admin/recipe/spoonacular/new",
	"/admin/recipe/edit",
];
const superAdminRoutes = ["/admin/signup"];
// const publicRoutes = ["/", "/recipe", ...authRoutes];
const userRoutes = ["/profile", "/recipe/new", "/recipe/my", "/recipe/edit"];

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isUserRoute = userRoutes.some(
		(route) => path === route || path.startsWith(`${route}/`)
	);
	// const isPublicRoute = publicRoutes.includes(path);
	const isAuthRoute = authRoutes.includes(path);
	const isAdminRoute = adminRoutes.some(
		(route) => path === route || path.startsWith(`${route}/`)
	);
	const isSuperAdminRoute = superAdminRoutes.some(
		(route) => path === route || path.startsWith(`${route}/`)
	);

	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	// Redirect to /login if the user is not authenticated
	if (!session?.userId) {
		if (isUserRoute) {
			return NextResponse.redirect(new URL("/login", request.nextUrl));
		}
		if (isAdminRoute || isSuperAdminRoute) {
			return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
		}
	}

	// Redirect to /recipe if the user is authenticated
	if (session?.userId && isAuthRoute) {
		if (session.role === "user") {
			return NextResponse.redirect(new URL("/recipe", request.nextUrl));
		} else {
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
		}
	}

	// Redirect to /recipe if the user is authenticated and tries to access other role routes
	if (session?.userId) {
		if (session.role === "user" && (isAdminRoute || isSuperAdminRoute)) {
			return NextResponse.redirect(new URL("/recipe", request.nextUrl));
		} else if (session.role === "admin" && (isUserRoute || isSuperAdminRoute)) {
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
		} else if (session.role === "superadmin" && isUserRoute) {
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
		}
	}

	// Redirect to / if the non superadmin user tries to access superadmin routes
	if (session?.userId && isSuperAdminRoute) {
		if (session.role !== "superadmin") {
			return NextResponse.redirect(new URL("/", request.nextUrl));
		}
	}

	updateSession();
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|logo.png|sitemap.xml|robots.txt).*)",
	],
};
