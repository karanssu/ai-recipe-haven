import DOMPurify from "isomorphic-dompurify";

export const toTitleCase = (str: string): string =>
	str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export const parseHTMLTextToHtmlWithoutLinks = (htmlText: string) => {
	const withoutLinks = htmlText.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");

	return DOMPurify.sanitize(withoutLinks);
};

export const parseHTMLTextToHtmlWithLinks = (htmlText: string) => {
	return DOMPurify.sanitize(htmlText, {
		ALLOWED_TAGS: [
			"a",
			"b",
			"i",
			"em",
			"strong",
			"p",
			"br",
			"ul",
			"ol",
			"li",
			"span",
		],
		ALLOWED_ATTR: [
			"href",
			"title",
			"target",
			"rel",
			"class",
			"className",
			"style",
		],
		USE_PROFILES: { html: true },
	});
};

export const getPlainTextFromHTML = (htmlText: string) => {
	const cleanHtml = DOMPurify.sanitize(htmlText, { ALLOWED_TAGS: [] });

	const plainText = cleanHtml
		.replace(/(https?:\/\/[^\s]+)/g, "")
		.replace(/(http?:\/\/[^\s]+)/g, "")
		.replace(/(www\.[^\s]+)/g, "")
		.trim();

	return plainText;
};

export const calculateRecipeRating = (
	ratings: { rating: number }[] | undefined
) => {
	if (!ratings) return 0;

	const ratingsCount = ratings.length;
	if (ratingsCount === 0) return 0;
	const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
	return Math.round((sum / ratingsCount) * 2) / 2;
};

export const getDisplayCaloriesWithUnit = (
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

export const getDisplayTotalCookingTimeWithUnit = (
	preparationMinutes: number,
	cookingMinutes: number
): { totalTime: number; unit: string } => {
	let unit = "m";
	let totalMinutes = preparationMinutes + cookingMinutes;
	if (totalMinutes > 60) {
		totalMinutes = totalMinutes / 60;
		unit = "h";
	}

	if (totalMinutes % 1 !== 0) {
		totalMinutes = parseFloat(totalMinutes.toFixed(2));
	}

	return { totalTime: totalMinutes, unit };
};

export const getDisplayTimeWithUnit = (timeMinutes: number): string => {
	let time = timeMinutes;
	let unit = "min";

	if (time >= 1440) {
		time = time / 1440;
		unit = "day";
	} else if (time >= 60) {
		time = time / 60;
		unit = "hour";
	}

	time = parseFloat(time?.toFixed(1));

	if (time !== 1) {
		unit += "s";
	}

	return `${time} ${unit}`;
};
