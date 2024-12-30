"use client";

import { useState } from "react";
import { User } from "@/app/lib/definitions";
import { Cancel01Icon as CloseIcon } from "hugeicons-react";
import { Delete02Icon as DeleteIcon } from "hugeicons-react";

export default function DeleteUserBtn({
	user,
	revalidatePageAction,
}: {
	user: User;
	revalidatePageAction: () => void;
}) {
	const [pending, setPending] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const handleDelete = async () => {
		setPending(true);
		const res = await fetch(`/api/user/${user._id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (res.ok) {
			closeModal();
			revalidatePageAction();
		}
		setPending(false);
	};

	return (
		<>
			<button
				className="bg-transparent hover:bg-transparent rounded-none"
				onClick={openModal}
			>
				<DeleteIcon className="text-darkGrayText hover:text-redText w-5" />
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
					onClick={closeModal}
				>
					<div
						className="relative w-full max-w-md px-7 py-6 bg-white rounded shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="bg-transparent hover:bg-transparent rounded-none absolute top-3 right-3"
							onClick={closeModal}
						>
							<CloseIcon className="text-grayText hover:text-darkGrayText w-5" />
						</button>

						<div className="font-title font-semibold text-2xl mb-3 break-words">
							Are you sure you want to delete this user?
						</div>
						<div className="space-y-2 text-base">
							<div>
								<span className="font-medium mr-2">Name:</span>
								{user.name}
							</div>
							<div>
								<span className="font-medium mr-2">Username:</span>
								{user.username}
							</div>
							<div>
								<span className="font-medium mr-2">Email:</span>
								{user.email}
							</div>
							<div>
								<span className="font-medium mr-2">Role:</span>
								{user.role}
							</div>
						</div>

						<div className="flex justify-end items-end mt-2 space-x-4">
							<button
								className="bg-redText hover:bg-darkRedText text-white px-5 py-2 rounded text"
								onClick={handleDelete}
							>
								{pending ? "Deleting..." : "Delete"}
							</button>
							<button
								className="bg-grayText hover:bg-darkGrayText text-white px-5 py-2 rounded text"
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
