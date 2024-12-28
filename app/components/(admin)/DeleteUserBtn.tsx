"use client";

import { useState } from "react";
import { User } from "@/app/lib/definitions";

export default function DeleteUserBtn({ user }: { user: User }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const handleDelete = async () => {
		const res = await fetch(`/api/user/${user._id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			closeModal();
			location.reload();
		}
	};

	return (
		<>
			<button
				className="ml-5 font-medium text-blue-600 hover:underline"
				onClick={openModal}
			>
				Delete
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
					onClick={closeModal}
				>
					<div
						className="relative w-full max-w-md p-6 bg-white rounded shadow-lg"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
					>
						<button
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
							onClick={closeModal}
						>
							&times;
						</button>

						<div>Are you sure you want to delete this user? </div>
						<div>Name: {user.name}</div>
						<div>Username: {user.username}</div>
						<div>Email: {user.email}</div>
						<div>Role: {user.role}</div>

						<div className="flex justify-end items-end mt-5 space-x-4">
							<button
								className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text"
								onClick={handleDelete}
							>
								Delete
							</button>
							<button
								className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded text"
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
