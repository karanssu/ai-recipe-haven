import {
	SignupFormSchema,
	FormState,
	LoginFormState,
} from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { createSession } from "../lib/session";

export async function signup(state: FormState, formData: FormData) {
	const name = formData.get("name")?.toString().trim();
	const username = formData.get("username")?.toString().trim();
	const email = formData.get("email")?.toString().trim();
	const password = formData.get("password");
	const user = { name, username, email, password };

	const validatedFields = SignupFormSchema.safeParse({
		name: name,
		username: username,
		email: email,
		password: password,
	});

	if (!validatedFields.success) {
		return {
			user: user,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const savedUser = await fetch("/api/auth/signup", {
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

	if (savedUser.ok) {
		redirect("/login");
	} else {
		const data = await savedUser.json();
		return {
			user: user,
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
			user: { usernameEmail: usernameEmail, password: password },
			error: user.error,
		};
	}
}

export async function adminSignup(state: FormState, formData: FormData) {
	const name = formData.get("name")?.toString().trim();
	const username = formData.get("username")?.toString().trim();
	const email = formData.get("email")?.toString().trim();
	const password = formData.get("password");
	const user = { name, username, email, password };

	const validatedFields = SignupFormSchema.safeParse({
		name: name,
		username: username,
		email: email,
		password: password,
	});

	if (!validatedFields.success) {
		return {
			user: user,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const savedUser = await fetch("/api/admin/auth/signup", {
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

	if (savedUser.ok) {
		redirect("/admin");
	} else {
		const data = await savedUser.json();
		return {
			user: user,
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

	const _id = formData.get("_id")?.toString().trim();
	const name = validatedFields.data.name.trim();
	const username = validatedFields.data.username.trim();
	const email = validatedFields.data.email.trim();
	const password = validatedFields.data.password;
	const profileImage = formData.get("profileImage")?.toString().trim();

	let data = null;

	if (passwordExist) {
		data = JSON.stringify({
			_id,
			name,
			username,
			email,
			password,
			profileImage,
		});
	} else {
		data = JSON.stringify({
			_id,
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
			user: data,
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
