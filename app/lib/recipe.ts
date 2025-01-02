export const calculateRecipeRating = (
	ratings: { rating: number }[] | undefined
) => {
	if (!ratings) return 0;

	const ratingsCount = ratings.length;
	if (ratingsCount === 0) return 0;
	const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
	return Math.round((sum / ratingsCount) * 2) / 2;
};

export const getCaloriesWithUnit = (
	calories: number
): { calories: number; unit: string } => {
	let unit = "cal";
	if (calories > 1000) {
		calories = calories / 1000;
		unit = "kcal";
	}

	if (calories % 1 !== 0) {
		calories = parseFloat(calories.toFixed(2));
	}

	return { calories, unit };
};
