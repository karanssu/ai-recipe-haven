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

// _id = id
// name = title
// image = image
// serving = servings
// preparationMinutes = preparationMinutes
// cookingMinutes = cookingMinutes
// user._id = $generated
// user.name = sourceName
// user.username = $generated
// user.profileImage = $generated
// tags = cuisines[] + dishTypes[] + diets[]
// ratings = spoonacularScore (0-100 -> 0-5) (first rating with superadmin id)
// calories = nutrition.nutrients[{"name": "Calories", "amount": #103, "unit": "kcal"}]
// fatGrams = nutrition.nutrients[{"name": "Fat", "amount": #3, "unit": "g"}]
// carbsGrams = nutrition.nutrients[{"name": "Carbohydrates", "amount": #20, "unit": "g"}]
// fiberGrams = nutrition.nutrients[{"name": "Fiber", "amount": #3, "unit": "g"}]
// sugarGrams = nutrition.nutrients[{"name": "Sugar", "amount": #3, "unit": "g"}]
// proteinGrams = nutrition.nutrients[{"name": "Protein", "amount": #3, "unit": "g"}]
// description = summary
// ingredients = extendedIngredients[{name, measures.us.amount, measures.us.unitShort}]
// cookingSteps = analyzedInstructions[0].steps[{number, step}]

export type Recipe = {
	_id: string | number;
	name: string;
	image: string;
	serving: number;
	preparationMinutes: number;
	cookingMinutes: number;
	user: {
		_id: string | number;
		name: string;
		username: string;
		profileImage?: string;
	};
	tags?: string[];
	ratings?: Rating[];
	calories?: number;
	fatGrams?: number;
	carbsGrams?: number;
	fiberGrams?: number;
	sugarGrams?: number;
	proteinGrams?: number;
	description?: string;
	ingredients: Ingredient[];
	cookingSteps: CookingStep[];
};

type CookingStep = {
	number: number;
	step: string;
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

export type RecipeReview = {
	_id: string | number;
	user: {
		userId: string | number;
		username: string;
		profileImage?: string;
	};
	review: string;
	likes: Like[];
	date: Date;
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
	serving: number;
	calories: number;
	preparationMinutes: number;
	cookingMinutes: number;
};

export type RawRecipe = {
	id: string;
	title: string;
	image: string;
	servings: number;
	preparationMinutes: number;
	cookingMinutes: number;
	sourceName: string;
	cuisines: string[];
	dishTypes: string[];
	diets: string[];
	spoonacularScore: number;
	nutrition: {
		nutrients: {
			name: string;
			amount: number;
		}[];
	};
	summary: string;
	extendedIngredients:
		| {
				id: string | number;
				name: string;
				measures: {
					us: {
						amount: number;
						unitShort: string;
					};
				};
		  }[]
		| undefined;
	analyzedInstructions: {
		steps: {
			number: number;
			step: string;
		}[];
	}[];
};
