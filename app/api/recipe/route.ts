import { Recipe } from "@/app/lib/definitions";
// import { saveRecipesInFile } from "@/app/lib/recipeUtils";

export async function GET(req: Request) {
	// only Frontend can access this route
	const referer = req.headers.get("referer");

	if (
		!referer ||
		!referer.startsWith(process.env.NEXT_PUBLIC_APP_URL as string)
	) {
		return Response.json({ error: "Unauthorized" }, { status: 403 });
	}

	// const lastRecipeNum = await getLastRecipeNum();
	// const lastRecipeNum = 10;

	const rawRecipes = [
		{
			vegetarian: true,
			vegan: true,
			glutenFree: true,
			dairyFree: true,
			veryHealthy: true,
			cheap: false,
			veryPopular: false,
			sustainable: false,
			lowFodmap: false,
			weightWatcherSmartPoints: 5,
			gaps: "no",
			preparationMinutes: null,
			cookingMinutes: null,
			aggregateLikes: 19,
			healthScore: 83,
			creditsText: "Foodista.com – The Cooking Encyclopedia Everyone Can Edit",
			license: "CC BY 3.0",
			sourceName: "Foodista",
			pricePerServing: 69.09,
			id: 644387,
			title: "Garlicky Kale",
			readyInMinutes: 45,
			servings: 2,
			sourceUrl: "https://www.foodista.com/recipe/J2FTJBF7/garlicky-kale",
			image: "https://img.spoonacular.com/recipes/644387-312x231.jpg",
			imageType: "jpg",
			nutrition: {
				nutrients: [
					{
						name: "Calories",
						amount: 169.87,
						unit: "kcal",
						percentOfDailyNeeds: 8.49,
					},
					{
						name: "Fat",
						amount: 14.98,
						unit: "g",
						percentOfDailyNeeds: 23.04,
					},
					{
						name: "Saturated Fat",
						amount: 2.05,
						unit: "g",
						percentOfDailyNeeds: 12.81,
					},
					{
						name: "Carbohydrates",
						amount: 7.46,
						unit: "g",
						percentOfDailyNeeds: 2.49,
					},
					{
						name: "Net Carbohydrates",
						amount: 4.76,
						unit: "g",
						percentOfDailyNeeds: 1.73,
					},
					{
						name: "Sugar",
						amount: 4.12,
						unit: "g",
						percentOfDailyNeeds: 4.58,
					},
					{
						name: "Cholesterol",
						amount: 0,
						unit: "mg",
						percentOfDailyNeeds: 0,
					},
					{
						name: "Sodium",
						amount: 40.51,
						unit: "mg",
						percentOfDailyNeeds: 1.76,
					},
					{
						name: "Alcohol",
						amount: 0,
						unit: "g",
						percentOfDailyNeeds: 100,
					},
					{
						name: "Alcohol %",
						amount: 0,
						unit: "%",
						percentOfDailyNeeds: 100,
					},
					{
						name: "Protein",
						amount: 2.11,
						unit: "g",
						percentOfDailyNeeds: 4.22,
					},
					{
						name: "Vitamin K",
						amount: 261.95,
						unit: "µg",
						percentOfDailyNeeds: 249.48,
					},
					{
						name: "Vitamin A",
						amount: 6493.63,
						unit: "IU",
						percentOfDailyNeeds: 129.87,
					},
					{
						name: "Vitamin C",
						amount: 61.18,
						unit: "mg",
						percentOfDailyNeeds: 74.16,
					},
					{
						name: "Manganese",
						amount: 0.48,
						unit: "mg",
						percentOfDailyNeeds: 24.24,
					},
					{
						name: "Calcium",
						amount: 174.43,
						unit: "mg",
						percentOfDailyNeeds: 17.44,
					},
					{
						name: "Vitamin E",
						amount: 2.45,
						unit: "mg",
						percentOfDailyNeeds: 16.31,
					},
					{
						name: "Vitamin B2",
						amount: 0.23,
						unit: "mg",
						percentOfDailyNeeds: 13.36,
					},
					{
						name: "Fiber",
						amount: 2.7,
						unit: "g",
						percentOfDailyNeeds: 10.79,
					},
					{
						name: "Folate",
						amount: 40.35,
						unit: "µg",
						percentOfDailyNeeds: 10.09,
					},
					{
						name: "Potassium",
						amount: 259.23,
						unit: "mg",
						percentOfDailyNeeds: 7.41,
					},
					{
						name: "Iron",
						amount: 1.32,
						unit: "mg",
						percentOfDailyNeeds: 7.32,
					},
					{
						name: "Magnesium",
						amount: 24.7,
						unit: "mg",
						percentOfDailyNeeds: 6.18,
					},
					{
						name: "Vitamin B6",
						amount: 0.11,
						unit: "mg",
						percentOfDailyNeeds: 5.71,
					},
					{
						name: "Vitamin B1",
						amount: 0.08,
						unit: "mg",
						percentOfDailyNeeds: 5.1,
					},
					{
						name: "Phosphorus",
						amount: 42.6,
						unit: "mg",
						percentOfDailyNeeds: 4.26,
					},
					{
						name: "Vitamin B3",
						amount: 0.78,
						unit: "mg",
						percentOfDailyNeeds: 3.89,
					},
					{
						name: "Copper",
						amount: 0.05,
						unit: "mg",
						percentOfDailyNeeds: 2.26,
					},
					{
						name: "Zinc",
						amount: 0.29,
						unit: "mg",
						percentOfDailyNeeds: 1.93,
					},
					{
						name: "Selenium",
						amount: 0.8,
						unit: "µg",
						percentOfDailyNeeds: 1.14,
					},
				],
				properties: [
					{
						name: "Glycemic Index",
						amount: 56,
						unit: "",
					},
					{
						name: "Glycemic Load",
						amount: 2.25,
						unit: "",
					},
					{
						name: "Inflammation Score",
						amount: -10,
						unit: "",
					},
					{
						name: "Nutrition Score",
						amount: 17.924782750399217,
						unit: "%",
					},
				],
				flavonoids: [
					{
						name: "Cyanidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Petunidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Delphinidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Malvidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Pelargonidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Peonidin",
						amount: 0,
						unit: "",
					},
					{
						name: "Catechin",
						amount: 0,
						unit: "",
					},
					{
						name: "Epigallocatechin",
						amount: 0,
						unit: "",
					},
					{
						name: "Epicatechin",
						amount: 0,
						unit: "",
					},
					{
						name: "Epicatechin 3-gallate",
						amount: 0,
						unit: "",
					},
					{
						name: "Epigallocatechin 3-gallate",
						amount: 0,
						unit: "",
					},
					{
						name: "Theaflavin",
						amount: 0,
						unit: "",
					},
					{
						name: "Thearubigins",
						amount: 0,
						unit: "",
					},
					{
						name: "Eriodictyol",
						amount: 0,
						unit: "",
					},
					{
						name: "Hesperetin",
						amount: 0,
						unit: "",
					},
					{
						name: "Naringenin",
						amount: 0,
						unit: "",
					},
					{
						name: "Apigenin",
						amount: 0.01,
						unit: "mg",
					},
					{
						name: "Luteolin",
						amount: 0.02,
						unit: "mg",
					},
					{
						name: "Isorhamnetin",
						amount: 15.34,
						unit: "mg",
					},
					{
						name: "Kaempferol",
						amount: 30.42,
						unit: "mg",
					},
					{
						name: "Myricetin",
						amount: 0.02,
						unit: "mg",
					},
					{
						name: "Quercetin",
						amount: 14.7,
						unit: "mg",
					},
					{
						name: "Theaflavin-3,3'-digallate",
						amount: 0,
						unit: "",
					},
					{
						name: "Theaflavin-3'-gallate",
						amount: 0,
						unit: "",
					},
					{
						name: "Theaflavin-3-gallate",
						amount: 0,
						unit: "",
					},
					{
						name: "Gallocatechin",
						amount: 0,
						unit: "",
					},
				],
				ingredients: [
					{
						id: 2069,
						name: "balsamic vinegar",
						amount: 1.5,
						unit: "tablespoons",
						nutrients: [
							{
								name: "Sodium",
								amount: 5.52,
								unit: "mg",
								percentOfDailyNeeds: 1.76,
							},
							{
								name: "Vitamin A",
								amount: 0,
								unit: "IU",
								percentOfDailyNeeds: 129.87,
							},
							{
								name: "Iron",
								amount: 0.17,
								unit: "mg",
								percentOfDailyNeeds: 7.32,
							},
							{
								name: "Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 23.04,
							},
							{
								name: "Protein",
								amount: 0.12,
								unit: "g",
								percentOfDailyNeeds: 4.22,
							},
							{
								name: "Potassium",
								amount: 26.88,
								unit: "mg",
								percentOfDailyNeeds: 7.41,
							},
							{
								name: "Magnesium",
								amount: 2.88,
								unit: "mg",
								percentOfDailyNeeds: 6.18,
							},
							{
								name: "Carbohydrates",
								amount: 4.09,
								unit: "g",
								percentOfDailyNeeds: 2.49,
							},
							{
								name: "Net Carbohydrates",
								amount: 4.09,
								unit: "g",
								percentOfDailyNeeds: 1.73,
							},
							{
								name: "Saturated Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 12.81,
							},
							{
								name: "Trans Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin C",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 74.16,
							},
							{
								name: "Copper",
								amount: 0.01,
								unit: "mg",
								percentOfDailyNeeds: 2.26,
							},
							{
								name: "Phosphorus",
								amount: 4.56,
								unit: "mg",
								percentOfDailyNeeds: 4.26,
							},
							{
								name: "Calories",
								amount: 21.12,
								unit: "kcal",
								percentOfDailyNeeds: 8.49,
							},
							{
								name: "Zinc",
								amount: 0.02,
								unit: "mg",
								percentOfDailyNeeds: 1.93,
							},
							{
								name: "Manganese",
								amount: 0.03,
								unit: "mg",
								percentOfDailyNeeds: 24.24,
							},
							{
								name: "Sugar",
								amount: 3.59,
								unit: "g",
								percentOfDailyNeeds: 4.58,
							},
							{
								name: "Calcium",
								amount: 6.48,
								unit: "mg",
								percentOfDailyNeeds: 17.44,
							},
						],
					},
					{
						id: 11215,
						name: "garlic",
						amount: 0.5,
						unit: "clove",
						nutrients: [
							{
								name: "Mono Unsaturated Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sodium",
								amount: 0.25,
								unit: "mg",
								percentOfDailyNeeds: 1.76,
							},
							{
								name: "Vitamin A",
								amount: 0.14,
								unit: "IU",
								percentOfDailyNeeds: 129.87,
							},
							{
								name: "Fat",
								amount: 0.01,
								unit: "g",
								percentOfDailyNeeds: 23.04,
							},
							{
								name: "Magnesium",
								amount: 0.38,
								unit: "mg",
								percentOfDailyNeeds: 6.18,
							},
							{
								name: "Lycopene",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B12",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B3",
								amount: 0.01,
								unit: "mg",
								percentOfDailyNeeds: 3.89,
							},
							{
								name: "Saturated Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 12.81,
							},
							{
								name: "Choline",
								amount: 0.35,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin E",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 16.31,
							},
							{
								name: "Vitamin C",
								amount: 0.47,
								unit: "mg",
								percentOfDailyNeeds: 74.16,
							},
							{
								name: "Manganese",
								amount: 0.03,
								unit: "mg",
								percentOfDailyNeeds: 24.24,
							},
							{
								name: "Vitamin B1",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 5.1,
							},
							{
								name: "Folate",
								amount: 0.05,
								unit: "µg",
								percentOfDailyNeeds: 10.09,
							},
							{
								name: "Net Carbohydrates",
								amount: 0.47,
								unit: "g",
								percentOfDailyNeeds: 1.73,
							},
							{
								name: "Vitamin B5",
								amount: 0.01,
								unit: "mg",
								percentOfDailyNeeds: 0.68,
							},
							{
								name: "Iron",
								amount: 0.03,
								unit: "mg",
								percentOfDailyNeeds: 7.32,
							},
							{
								name: "Protein",
								amount: 0.1,
								unit: "g",
								percentOfDailyNeeds: 4.22,
							},
							{
								name: "Carbohydrates",
								amount: 0.5,
								unit: "g",
								percentOfDailyNeeds: 2.49,
							},
							{
								name: "Selenium",
								amount: 0.21,
								unit: "µg",
								percentOfDailyNeeds: 1.14,
							},
							{
								name: "Potassium",
								amount: 6.01,
								unit: "mg",
								percentOfDailyNeeds: 7.41,
							},
							{
								name: "Vitamin D",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Poly Unsaturated Fat",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B6",
								amount: 0.02,
								unit: "mg",
								percentOfDailyNeeds: 5.71,
							},
							{
								name: "Alcohol",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 100,
							},
							{
								name: "Cholesterol",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Fiber",
								amount: 0.03,
								unit: "g",
								percentOfDailyNeeds: 10.79,
							},
							{
								name: "Vitamin K",
								amount: 0.03,
								unit: "µg",
								percentOfDailyNeeds: 249.48,
							},
							{
								name: "Folic Acid",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Zinc",
								amount: 0.02,
								unit: "mg",
								percentOfDailyNeeds: 1.93,
							},
							{
								name: "Phosphorus",
								amount: 2.3,
								unit: "mg",
								percentOfDailyNeeds: 4.26,
							},
							{
								name: "Vitamin B2",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 13.36,
							},
							{
								name: "Calories",
								amount: 2.23,
								unit: "kcal",
								percentOfDailyNeeds: 8.49,
							},
							{
								name: "Copper",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 2.26,
							},
							{
								name: "Caffeine",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sugar",
								amount: 0.01,
								unit: "g",
								percentOfDailyNeeds: 4.58,
							},
							{
								name: "Calcium",
								amount: 2.71,
								unit: "mg",
								percentOfDailyNeeds: 17.44,
							},
						],
					},
					{
						id: 11233,
						name: "curly kale",
						amount: 0.5,
						unit: "bunch",
						nutrients: [
							{
								name: "Mono Unsaturated Fat",
								amount: 0.07,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sodium",
								amount: 34.45,
								unit: "mg",
								percentOfDailyNeeds: 1.76,
							},
							{
								name: "Vitamin A",
								amount: 6493.5,
								unit: "IU",
								percentOfDailyNeeds: 129.87,
							},
							{
								name: "Fat",
								amount: 0.97,
								unit: "g",
								percentOfDailyNeeds: 23.04,
							},
							{
								name: "Magnesium",
								amount: 21.45,
								unit: "mg",
								percentOfDailyNeeds: 6.18,
							},
							{
								name: "Lycopene",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B12",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B3",
								amount: 0.77,
								unit: "mg",
								percentOfDailyNeeds: 3.89,
							},
							{
								name: "Saturated Fat",
								amount: 0.12,
								unit: "g",
								percentOfDailyNeeds: 12.81,
							},
							{
								name: "Choline",
								amount: 0.32,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin E",
								amount: 0.43,
								unit: "mg",
								percentOfDailyNeeds: 16.31,
							},
							{
								name: "Vitamin C",
								amount: 60.71,
								unit: "mg",
								percentOfDailyNeeds: 74.16,
							},
							{
								name: "Manganese",
								amount: 0.43,
								unit: "mg",
								percentOfDailyNeeds: 24.24,
							},
							{
								name: "Vitamin B1",
								amount: 0.07,
								unit: "mg",
								percentOfDailyNeeds: 5.1,
							},
							{
								name: "Folate",
								amount: 40.3,
								unit: "µg",
								percentOfDailyNeeds: 10.09,
							},
							{
								name: "Net Carbohydrates",
								amount: 0.21,
								unit: "g",
								percentOfDailyNeeds: 1.73,
							},
							{
								name: "Vitamin B5",
								amount: 0.06,
								unit: "mg",
								percentOfDailyNeeds: 0.68,
							},
							{
								name: "Iron",
								amount: 1.04,
								unit: "mg",
								percentOfDailyNeeds: 7.32,
							},
							{
								name: "Protein",
								amount: 1.9,
								unit: "g",
								percentOfDailyNeeds: 4.22,
							},
							{
								name: "Carbohydrates",
								amount: 2.87,
								unit: "g",
								percentOfDailyNeeds: 2.49,
							},
							{
								name: "Selenium",
								amount: 0.58,
								unit: "µg",
								percentOfDailyNeeds: 1.14,
							},
							{
								name: "Potassium",
								amount: 226.2,
								unit: "mg",
								percentOfDailyNeeds: 7.41,
							},
							{
								name: "Vitamin D",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Poly Unsaturated Fat",
								amount: 0.44,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B6",
								amount: 0.1,
								unit: "mg",
								percentOfDailyNeeds: 5.71,
							},
							{
								name: "Alcohol",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 100,
							},
							{
								name: "Cholesterol",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Fiber",
								amount: 2.66,
								unit: "g",
								percentOfDailyNeeds: 10.79,
							},
							{
								name: "Vitamin K",
								amount: 253.5,
								unit: "µg",
								percentOfDailyNeeds: 249.48,
							},
							{
								name: "Folic Acid",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Zinc",
								amount: 0.25,
								unit: "mg",
								percentOfDailyNeeds: 1.93,
							},
							{
								name: "Phosphorus",
								amount: 35.75,
								unit: "mg",
								percentOfDailyNeeds: 4.26,
							},
							{
								name: "Vitamin B2",
								amount: 0.23,
								unit: "mg",
								percentOfDailyNeeds: 13.36,
							},
							{
								name: "Calories",
								amount: 22.75,
								unit: "kcal",
								percentOfDailyNeeds: 8.49,
							},
							{
								name: "Copper",
								amount: 0.03,
								unit: "mg",
								percentOfDailyNeeds: 2.26,
							},
							{
								name: "Caffeine",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sugar",
								amount: 0.52,
								unit: "g",
								percentOfDailyNeeds: 4.58,
							},
							{
								name: "Calcium",
								amount: 165.1,
								unit: "mg",
								percentOfDailyNeeds: 17.44,
							},
						],
					},
					{
						id: 4053,
						name: "olive oil",
						amount: 1,
						unit: "servings",
						nutrients: [
							{
								name: "Mono Unsaturated Fat",
								amount: 10.22,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sodium",
								amount: 0.28,
								unit: "mg",
								percentOfDailyNeeds: 1.76,
							},
							{
								name: "Vitamin A",
								amount: 0,
								unit: "IU",
								percentOfDailyNeeds: 129.87,
							},
							{
								name: "Fat",
								amount: 14,
								unit: "g",
								percentOfDailyNeeds: 23.04,
							},
							{
								name: "Magnesium",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 6.18,
							},
							{
								name: "Lycopene",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B12",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B3",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 3.89,
							},
							{
								name: "Saturated Fat",
								amount: 1.93,
								unit: "g",
								percentOfDailyNeeds: 12.81,
							},
							{
								name: "Choline",
								amount: 0.04,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin E",
								amount: 2.02,
								unit: "mg",
								percentOfDailyNeeds: 16.31,
							},
							{
								name: "Vitamin C",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 74.16,
							},
							{
								name: "Manganese",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 24.24,
							},
							{
								name: "Vitamin B1",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 5.1,
							},
							{
								name: "Folate",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 10.09,
							},
							{
								name: "Net Carbohydrates",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 1.73,
							},
							{
								name: "Vitamin B5",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0.68,
							},
							{
								name: "Iron",
								amount: 0.08,
								unit: "mg",
								percentOfDailyNeeds: 7.32,
							},
							{
								name: "Protein",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 4.22,
							},
							{
								name: "Carbohydrates",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 2.49,
							},
							{
								name: "Selenium",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 1.14,
							},
							{
								name: "Potassium",
								amount: 0.14,
								unit: "mg",
								percentOfDailyNeeds: 7.41,
							},
							{
								name: "Vitamin D",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Poly Unsaturated Fat",
								amount: 1.47,
								unit: "g",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Vitamin B6",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 5.71,
							},
							{
								name: "Alcohol",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 100,
							},
							{
								name: "Cholesterol",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Fiber",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 10.79,
							},
							{
								name: "Vitamin K",
								amount: 8.43,
								unit: "µg",
								percentOfDailyNeeds: 249.48,
							},
							{
								name: "Folic Acid",
								amount: 0,
								unit: "µg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Zinc",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 1.93,
							},
							{
								name: "Phosphorus",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 4.26,
							},
							{
								name: "Vitamin B2",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 13.36,
							},
							{
								name: "Calories",
								amount: 123.76,
								unit: "kcal",
								percentOfDailyNeeds: 8.49,
							},
							{
								name: "Copper",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 2.26,
							},
							{
								name: "Caffeine",
								amount: 0,
								unit: "mg",
								percentOfDailyNeeds: 0,
							},
							{
								name: "Sugar",
								amount: 0,
								unit: "g",
								percentOfDailyNeeds: 4.58,
							},
							{
								name: "Calcium",
								amount: 0.14,
								unit: "mg",
								percentOfDailyNeeds: 17.44,
							},
						],
					},
				],
				caloricBreakdown: {
					percentProtein: 4.88,
					percentFat: 77.89,
					percentCarbs: 17.23,
				},
				weightPerServing: {
					amount: 105,
					unit: "g",
				},
			},
			summary:
				'Garlicky Kale requires approximately <b>45 minutes</b> from start to finish. This side dish has <b>170 calories</b>, <b>2g of protein</b>, and <b>15g of fat</b> per serving. This recipe serves 2. For <b>69 cents per serving</b>, this recipe <b>covers 17%</b> of your daily requirements of vitamins and minerals. 19 people have made this recipe and would make it again. This recipe from Foodista requires balsamic vinegar, garlic, curly kale, and olive oil. It is a good option if you\'re following a <b>gluten free, dairy free, paleolithic, and lacto ovo vegetarian</b> diet. With a spoonacular <b>score of 99%</b>, this dish is outstanding. Try <a href="https://spoonacular.com/recipes/garlicky-kale-248759">Garlicky Kale</a>, <a href="https://spoonacular.com/recipes/garlicky-kale-1267347">Garlicky Kale</a>, and <a href="https://spoonacular.com/recipes/garlicky-kale-1584523">Garlicky Kale</a> for similar recipes.',
			cuisines: [],
			dishTypes: ["side dish"],
			diets: [
				"gluten free",
				"dairy free",
				"paleolithic",
				"lacto ovo vegetarian",
				"primal",
				"whole 30",
				"vegan",
			],
			occasions: [],
			analyzedInstructions: [
				{
					name: "",
					steps: [
						{
							number: 1,
							step: "Heat the olive oil in a large pot over medium heat.",
							ingredients: [
								{
									id: 4053,
									name: "olive oil",
									localizedName: "olive oil",
									image: "olive-oil.jpg",
								},
							],
							equipment: [
								{
									id: 404752,
									name: "pot",
									localizedName: "pot",
									image:
										"https://spoonacular.com/cdn/equipment_100x100/stock-pot.jpg",
								},
							],
						},
						{
							number: 2,
							step: "Add the kale and cover.Stir occasionally until the volume of the kale is reduced by half. Uncover.",
							ingredients: [
								{
									id: 11233,
									name: "kale",
									localizedName: "kale",
									image: "kale.jpg",
								},
							],
							equipment: [],
						},
						{
							number: 3,
							step: "Add garlic and basalmic.Allow to cook for about another 30 seconds or so, mixing well so that the garlic and vinegar are well distributed.",
							ingredients: [
								{
									id: 2053,
									name: "vinegar",
									localizedName: "vinegar",
									image: "vinegar-(white).jpg",
								},
								{
									id: 11215,
									name: "garlic",
									localizedName: "garlic",
									image: "garlic.png",
								},
							],
							equipment: [],
						},
						{
							number: 4,
							step: "Serve hot.",
							ingredients: [],
							equipment: [],
						},
					],
				},
			],
			spoonacularScore: 98.93987274169922,
			spoonacularSourceUrl: "https://spoonacular.com/garlicky-kale-644387",
		},
	];
	// const recipes = await getRecipes(lastRecipeNum);
	const recipes = parseRecipes(rawRecipes);
	console.log("recipes:\n", recipes);
	// saveRecipesInFile(recipes);
	// saveRecipesInDB(recipes);
	// return Response.json({ recipes: recipes }, { status: 200 });

	// return Response.json(
	// 	{
	// 		errors: { error: "Username already exists" },
	// 	},
	// 	{ status: 500 }
	// );
	return Response.json({ recipes: recipes }, { status: 200 });
}

// const getRecipes = async (lastRecipeNum: number) => {
// 	const startRecipeNum = lastRecipeNum + 1;
// 	const totalRecipes = 10;

// 	const res = await fetch(
// 		`https://api.spoonacular.com/recipes/complexSearch?addRecipeInstructions=true&addRecipeNutrition=true&sortDirection=desc&offset=${startRecipeNum}&number=${totalRecipes}&apiKey=${process.env.SPOONACULAR_API_KEY}`
// 	);

// 	const data = await res.json();
// 	const rawRecipes = data.results;
// 	saveRecipesInFile(rawRecipes);

// 	console.log("rawRecipes:\n", rawRecipes);

// 	return rawRecipes;
// };

const parseRecipes = (rawRecipes: object[]): Recipe[] => {
	const result: Recipe[] = [];

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

	rawRecipes.forEach((rawRecipe: any) => {
		const recipe: Recipe = {
			_id: rawRecipe.id,
			name: rawRecipe.title,
			image: rawRecipe.image,
			serving: rawRecipe.servings,
			preparationMinutes: rawRecipe.preparationMinutes,
			cookingMinutes: rawRecipe.cookingMinutes,
			user: {
				_id: "$generated" + rawRecipe.id,
				name: rawRecipe.sourceName,
				username: "generated",
			},
			tags: rawRecipe.cuisines.concat(rawRecipe.dishTypes, rawRecipe.diets),
			ratings: [
				{
					_id: "$generated" + rawRecipe.id,
					rating: Math.round((rawRecipe.spoonacularScore / 20) * 2) / 2,
					userId: rawRecipe.id,
				},
			],
			calories: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Calories"
			).amount,
			fatGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Fat"
			).amount,
			carbsGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Carbohydrates"
			).amount,
			fiberGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Fiber"
			).amount,
			sugarGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Sugar"
			).amount,
			proteinGrams: rawRecipe.nutrition.nutrients.find(
				(n: { name: string }) => n.name === "Protein"
			).amount,
			description: rawRecipe.summary,
			ingredients:
				rawRecipe.extendedIngredients?.map((ingredient: any) => {
					return {
						name: ingredient.name,
						amount: ingredient.measures.us.amount,
						unit: ingredient.measures.us.unitShort,
					};
				}) || [],
			cookingSteps: rawRecipe.analyzedInstructions[0].steps.map((step: any) => {
				return {
					number: step.number,
					step: step.step,
				};
			}),
		};
		result.push(recipe);
	});

	return result;
};
