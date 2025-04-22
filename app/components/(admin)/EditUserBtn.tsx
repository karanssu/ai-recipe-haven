"use client";

import { useState } from "react";
import EditUserForm from "./EditUserForm";
import { User } from "@/app/lib/definitions";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import { PencilEdit02Icon as EditIcon } from "hugeicons-react";

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
				className="bg-transparent hover:bg-transparent rounded-none"
				onClick={openModal}
			>
				<EditIcon className="p-1 w-7 h-7 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white rounded" />
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
					onClick={closeModal}
				>
					<div
						className="relative w-full max-w-md px-8 pt-5 pb-8 bg-white rounded shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="bg-transparent hover:bg-transparent rounded-none absolute top-3 right-3"
							onClick={closeModal}
						>
							<CloseIcon className="p-1 w-7 h-7 bg-transparent hover:bg-gray-300 text-gray-400 hover:text-white rounded" />
						</button>

						<EditUserForm user={user} revalidatePageAction={revalidateAction} />
					</div>
				</div>
			)}
		</>
	);
}
