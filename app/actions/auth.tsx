import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
	const validatedFields = SignupFormSchema.safeParse({
		name: formData.get("name"),
		username: formData.get("username"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const name = validatedFields.data.name.trim();
	const username = validatedFields.data.username.trim();
	const email = validatedFields.data.email.trim();
	const password = validatedFields.data.password;

	const user = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			username,
			email,
			password,
		}),
	});

	if (user.ok) {
		redirect("/login");
	} else {
		const data = await user.json();
		return {
			errors: data.errors,
		};
	}
}
