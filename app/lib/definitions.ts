import { z } from "zod";

export const SignupFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name must be at least 2 characters long." })
		.trim(),
	username: z
		.string()
		.min(5, { message: "Name must be at least 5 characters long." })
		.trim(),
	email: z.string().email({ message: "Please enter a valid email." }).trim(),
	password: z
		.string()
		.min(8, { message: "Be at least 8 characters long" })
		.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
		.regex(/[0-9]/, { message: "Contain at least one number." })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Contain at least one special character.",
		})
		.trim(),
});

export type FormState =
	| {
			errors?: {
				name?: string[];
				username?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;

export type LoginFormState =
	| {
			error?: string;
			message?: string;
	  }
	| undefined;

export type SessionPayload = {
	userId: string | number;
	name: string;
	username: string;
	profileImage: string;
	role: string;
	expiresAt: Date;
};

export type User = {
	_id: string | number;
	name: string;
	username: string;
	email: string;
	password?: string;
	profileImage?: string;
	role: string;
};

export type SessionUser = {
	_id: string | number;
	name: string;
	username: string;
	profileImage?: string;
	role: string;
};

export type Recipe = {
	_id: string | number;
	image: string;
	tags?: string[];
	user: {
		_id: string | number;
		name: string;
		username: string;
		profileImage?: string;
	};
	name: string;
	ratings?: Rating[];
	reviews?: Review[];
	level?: string;
	people: number;
	maxPeople: number;
	calories?: number;
	fatGrams?: number;
	carbsGrams?: number;
	fiberGrams?: number;
	sugarGrams?: number;
	proteinGrams?: number;
	preparationTime?: number;
	cookingTime: number;
	description?: string;
	ingredients: Ingredient[];
	cookingSteps: CookingStep[];
};

type CookingStep = {
	_id: string | number;
	number: number;
	description: string;
	image?: string;
};

type Ingredient = {
	_id: string | number;
	name: string;
	quantity?: number;
	unit?: string;
};

type Like = {
	_id: string | number;
	userId: string | number;
};

type Comment = {
	_id: string | number;
	userId: string | number;
	comment: string;
	date: Date;
};

type Review = {
	_id: string | number;
	userId: string | number;
	review: string;
	likes: Like[];
	date: Date;
	rating?: number;
	comments?: Comment[];
};

type Rating = {
	_id: string | number;
	userId: string | number;
	rating: number;
};

export type RecipeCardDef = {
	_id: string | number;
	image: string;
	tags?: string[];
	user: { _id: string | number; username: string; profileImage?: string };
	name: string;
	ratings?: Rating[];
	level?: string;
	people: number;
	calories?: number;
	cookingTime: number;
};
