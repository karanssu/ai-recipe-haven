"use client";

import { updateUser } from "@/app/actions/auth";
import { useActionState } from "react";
import { User } from "@/app/lib/definitions";

export default function EditUserForm({
	user,
	revalidatePageAction,
}: {
	user: User;
	revalidatePageAction: () => void;
}) {
	const [state, action, pending] = useActionState(updateUser, undefined);
	if (state?.user) {
		user = { ...user, ...state.user };
	}
	if (state?.ok) {
		revalidatePageAction();
	}

	return (
		<form action={action}>
			<div className="text-3xl text-center font-semibold mb-8">Edit User</div>
			{state?.ok && (
				<div
					className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
					role="alert"
				>
					{state.message}
				</div>
			)}
			{state?.errors?.error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
					role="alert"
				>
					{state.errors.error}
				</div>
			)}
			<input type="hidden" name="_id" value={user._id} />
			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Full Name</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
					name="name"
					type="text"
					placeholder="Full Name"
					defaultValue={user.name}
				/>
			</div>
			{state?.errors?.name && (
				<p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
			)}

			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Username</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
					name="username"
					type="text"
					placeholder="Username"
					defaultValue={user.username}
				/>
			</div>
			{state?.errors?.username && (
				<p className="text-red-500 text-sm mt-1">{state.errors.username}</p>
			)}

			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Email</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
					name="email"
					type="email"
					placeholder="Email"
					defaultValue={user.email}
				/>
			</div>
			{state?.errors?.email && (
				<p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
			)}

			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Password</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
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

			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Profile Img URL</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
					name="profileImage"
					type="text"
					placeholder="Profile Image URL"
					defaultValue={user.profileImage}
				/>
			</div>

			<div className="flex justify-center items-center mt-5">
				<label className="text text-gray-600 w-24 mr-5">Role</label>
				<input
					className="border-2 border-gray-200 p-2 rounded-lg w-full"
					name="role"
					type="text"
					defaultValue={user.role}
					disabled={true}
				/>
			</div>

			<button
				className="bg-Green hover:bg-green-500 text-white font-bold py-2 px-4 rounded w-full mt-5"
				disabled={pending}
				type="submit"
			>
				{pending ? "Updating user..." : "Update User"}
			</button>
		</form>
	);
}
