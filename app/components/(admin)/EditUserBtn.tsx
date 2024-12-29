"use client";

import { useState } from "react";
import EditUserForm from "./EditUserForm";
import { User } from "@/app/lib/definitions";

export default function EditUserBtn({
	user,
	revalidatePageAction,
}: {
	user: User;

	revalidatePageAction: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const revalidateAction = () => {
		"use client";

		closeModal();
		revalidatePageAction();
	};

	return (
		<>
			<button
				className="ml-5 font-medium text-blue-600 hover:underline"
				onClick={openModal}
			>
				Edit
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

						<EditUserForm user={user} revalidatePageAction={revalidateAction} />
					</div>
				</div>
			)}
		</>
	);
}
