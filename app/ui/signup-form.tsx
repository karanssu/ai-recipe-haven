"use client";

import { signup } from "@/app/actions/auth";
import { useActionState } from "react";

export default function SignupForm() {
	const [state, action, pending] = useActionState(signup, undefined);

	return (
		<form action={action}>
			<div>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full mt-2"
					name="name"
					type="text"
					placeholder="Full Name"
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
						{state.errors.password.map((error) => (
							<li className="text-red-500 text-sm mt-1" key={error}>
								- {error}
							</li>
						))}
					</ul>
				</div>
			)}
			<button
				className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
				disabled={pending}
				type="submit"
			>
				{pending ? "Signing up..." : "Sign Up"}
			</button>
		</form>
	);
}
