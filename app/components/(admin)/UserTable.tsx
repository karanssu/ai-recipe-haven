import { User } from "../../lib/definitions";
import DeleteUserBtn from "./DeleteUserBtn";
import EditUserBtn from "./EditUserBtn";

export default function UserTable({
	users,
	revalidatePageAction,
}: {
	users: User[];
	revalidatePageAction: () => void;
}) {
	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							No.
						</th>
						<th scope="col" className="px-6 py-3">
							Name
						</th>
						<th scope="col" className="px-6 py-3">
							Username
						</th>
						<th scope="col" className="px-6 py-3">
							Email
						</th>
						<th scope="col" className="px-6 py-3">
							Role
						</th>
						<th scope="col" className="px-6 py-3">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={user._id} className="bg-white border-b text-gray-900">
							<td className="px-6 py-4">{index + 1}</td>
							<td className="px-6 py-4">{user.name}</td>
							<td className="px-6 py-4">{user.username}</td>
							<td className="px-6 py-4">{user.email}</td>
							<td className="px-6 py-4">{user.role}</td>
							<td className="px-6 py-4">
								<EditUserBtn
									user={user}
									revalidatePageAction={revalidatePageAction}
								/>
								<DeleteUserBtn
									user={user}
									revalidatePageAction={revalidatePageAction}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
