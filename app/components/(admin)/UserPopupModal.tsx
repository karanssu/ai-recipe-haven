"use client";

import { useState } from "react";
import EditUserForm from "./EditUserForm";

export default function UserPopupModal() {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<div className="flex items-center justify-center h-screen">
			<button
				className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
				onClick={openModal}
			>
				Edit User
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

						<EditUserForm />
					</div>
				</div>
			)}
		</div>
	);
}
