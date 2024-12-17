# AI Recipe Haven

AI Recipe Haven is an innovative recipe platform designed to make home cooking easier, more personalized, and community-driven. With AI-powered suggestions, robust dietary filters, and interactive features, it’s your ultimate companion for meal planning and discovering recipes that fit your preferences and lifestyle.

## Features

- **AI Cooking Assistant**: Get real-time cooking tips and personalized recipe suggestions using the [OpenAI API](https://platform.openai.com/overview).
- **Diverse Recipes**: Access a vast collection of recipes across cuisines via the [Spoonacular API](https://spoonacular.com/food-api).
- **Powerful Filters**: Search recipes by calories, cooking time, ingredients, allergens, and more.
- **Community Interaction**: Share recipes, rate dishes, and leave comments to connect with other food enthusiasts.
- **Meal Planning**: Plan weekly meals and generate shopping lists with ease.

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org) for server-side rendering and optimized performance.
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for responsive and consistent UI design.
- **Backend**: [Next.js](https://nextjs.org) runtime with [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com) for scalable data storage.
- **APIs**:
  - [OpenAI](https://platform.openai.com/overview) for AI-powered chat and suggestions.
  - [Spoonacular](https://spoonacular.com/food-api) to fetch recipes and nutritional data.

## Getting Started

Follow these steps to run the project locally:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:

```bash
  git clone https://github.com/karanssu/ai-recipe-haven.git
  cd ai-recipe-haven
```

2. Install dependencies:

```bash
  npm install
```

3. Create an .env file with the following keys:

- OPENAI_API_KEY for AI chat features.
- SPOONACULAR_API_KEY for fetching recipe data.

### Run the Development Server

Start the server:

```bash
  npm run dev
```

visit http://localhost:3000 to see the app in action.

### Contribution Guidelines

We welcome feedback and contributions!
Feel free to open an issue or submit a pull request to improve the project.

### Future Plans

- Mobile App Integration: A mobile version for better accessibility.
- Recipe Video Tutorials: Add video guides for recipes.
- Enhanced AI: Fine-tuned AI models for better personalization.

Start cooking smarter with AI Recipe Haven—your one-stop recipe platform!
