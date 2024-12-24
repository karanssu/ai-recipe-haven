"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
	const [state, action, pending] = useActionState(login, undefined);

	return (
		<form action={action}>
			{state?.error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
					role="alert"
				>
					{state.error}
				</div>
			)}
			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="usernameEmail"
					type="text"
					placeholder="Email or username"
				/>
			</div>

			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="password"
					type="password"
					placeholder="Password"
				/>
			</div>
			<button
				className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
				disabled={pending}
				type="submit"
			>
				{pending ? "Log in..." : "Log in"}
			</button>
		</form>
	);
}
