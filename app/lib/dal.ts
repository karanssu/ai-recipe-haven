"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { cache } from "react";

export const verifySession = cache(async () => {
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (!session?.userId) {
		return null;
	}

	return {
		isAuth: true,
		userId: session?.userId,
		name: session?.name,
		username: session?.username,
		profileImage: session?.profileImage,
		role: session?.role,
	};
});
