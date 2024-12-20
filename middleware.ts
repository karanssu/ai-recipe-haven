import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
	const session = await auth();

	if (!session?.user) {
		if (
			request.nextUrl.pathname == "/" ||
			request.nextUrl.pathname.startsWith("/login") ||
			request.nextUrl.pathname.startsWith("/signup") ||
			request.nextUrl.pathname.startsWith("/recipe") ||
			request.nextUrl.pathname.match("/dashboard$") ||
			request.nextUrl.pathname.startsWith("/admin/login")
		) {
			return NextResponse.next();
		} else {
			if (request.nextUrl.pathname.startsWith("/admin")) {
				return NextResponse.redirect(new URL("/admin/login", request.url));
			}

			return NextResponse.redirect(new URL("/login", request.url));
		}
	}
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
