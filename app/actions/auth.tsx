import {
	SignupFormSchema,
	FormState,
	LoginFormState,
} from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { createSession } from "../lib/session";

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

export async function login(state: LoginFormState, formData: FormData) {
	const usernameEmail = formData.get("usernameEmail")?.toString().trim();
	const password = formData.get("password")?.toString().trim();

	const data = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			usernameEmail,
			password,
		}),
	});
	const user = await data.json();

	if (data.ok) {
		await createSession(
			user._id,
			user.name,
			user.username,
			user.profileImage,
			user.role
		);
		redirect("/dashboard");
	} else {
		return {
			error: user.error,
		};
	}
}

export async function adminSignup(state: FormState, formData: FormData) {
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

	const user = await fetch("/api/admin/auth/signup", {
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
		redirect("/admin");
	} else {
		const data = await user.json();
		return {
			errors: data.errors,
		};
	}
}

export async function adminLogin(state: LoginFormState, formData: FormData) {
	const usernameEmail = formData.get("usernameEmail")?.toString().trim();
	const password = formData.get("password")?.toString().trim();

	const data = await fetch("/api/admin/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			usernameEmail,
			password,
		}),
	});
	const user = await data.json();

	if (data.ok) {
		await createSession(
			user._id,
			user.name,
			user.username,
			user.profileImage,
			user.role
		);
		redirect("/admin");
	} else {
		return {
			error: user.error,
		};
	}
}

export async function updateUser(state: FormState, formData: FormData) {
	const DEFAULT_VALID_PASSWORD = "ValidPassword123!";
	const passwordExist = formData.get("password") !== "";
	const validationPassword = passwordExist
		? formData.get("password")
		: DEFAULT_VALID_PASSWORD;

	const validatedFields = SignupFormSchema.safeParse({
		name: formData.get("name"),
		username: formData.get("username"),
		email: formData.get("email"),
		password: validationPassword,
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
	const profileImage = formData.get("profileImage")?.toString().trim();

	let data = null;

	if (passwordExist) {
		data = JSON.stringify({
			name,
			username,
			email,
			password,
			profileImage,
		});
	} else {
		data = JSON.stringify({
			name,
			username,
			email,
			profileImage,
		});
	}

	const user = await fetch("/api/user", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: data,
	});

	if (user.ok) {
		return {
			message: "User updated successfully",
			ok: true,
		};
	} else {
		const data = await user.json();
		return {
			errors: data.errors,
		};
	}
}
