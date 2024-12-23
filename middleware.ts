import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

const authRoutes = ["/login", "/signup", "/admin/login"];
const publicRoutes = [...authRoutes, "/recipe"];
const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"];
const superAdminRoutes = ["/super-admin"];

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);
	const isAuthRoute = authRoutes.includes(path);
	const isAdminRoute = adminRoutes.includes(path);
	const isSuperAdminRoute = superAdminRoutes.includes(path);

	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	// Redirect to /login if the user is not authenticated
	if (!session?.userId) {
		if (isProtectedRoute) {
			return NextResponse.redirect(new URL("/login", request.nextUrl));
		}
		if (isAdminRoute || isSuperAdminRoute) {
			return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
		}
	}

	// Redirect to /dashboard if the user is authenticated
	if (session?.userId && isAuthRoute) {
		if (session.role === "user") {
			return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
		} else {
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
		}
	}

	// Redirect to /dashboard if the user is authenticated and tries to access higher role routes
	if (session?.userId) {
		if (session.role === "user" && (isAdminRoute || isSuperAdminRoute)) {
			return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
		} else if (session.role === "admin" && isSuperAdminRoute) {
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|logo.png|sitemap.xml|robots.txt).*)",
	],
};
