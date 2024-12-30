"use client";

import { adminSignup } from "@/app/actions/auth";
import { useActionState } from "react";

export default function AdminSignupForm() {
	const [state, action, pending] = useActionState(adminSignup, undefined);

	return (
		<form action={action}>
			{state?.errors?.error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
					role="alert"
				>
					{state.errors.error}
				</div>
			)}
			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="name"
					type="text"
					placeholder="Full Name"
					defaultValue={state?.user?.name || ""}
				/>
			</div>
			{state?.errors?.name && (
				<p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
			)}

			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="username"
					type="text"
					placeholder="Username"
					defaultValue={state?.user?.username || ""}
				/>
			</div>
			{state?.errors?.username && (
				<p className="text-red-500 text-sm mt-1">{state.errors.username}</p>
			)}

			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="email"
					type="email"
					placeholder="Email"
					defaultValue={state?.user?.email || ""}
				/>
			</div>
			{state?.errors?.email && (
				<p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
			)}

			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-5"
					name="password"
					type="password"
					placeholder="Password"
				/>
			</div>
			{state?.errors?.password && (
				<div>
					<p className="text-red-500 text-sm mt-1">Password must:</p>
					<ul>
						{state.errors.password.map((error: string) => (
							<li className="text-red-500 text-sm mt-1" key={error}>
								- {error}
							</li>
						))}
					</ul>
				</div>
			)}
			<button
				className="bg-primaryBg hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
				disabled={pending}
				type="submit"
			>
				{pending ? "Signing up..." : "Sign Up"}
			</button>
		</form>
	);
}
