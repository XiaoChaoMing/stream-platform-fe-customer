# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname
    }
  }
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules
  }
});
```

"# base-react-v2"

# React TypeScript Base Project

A modern React TypeScript project with best practices and common integrations.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components
│   ├── product/         # Product-related components
│   └── ui/              # Shadcn UI components
├── config/              # Configuration files
│   ├── minio.ts         # MinIO configuration
│   ├── socket.ts        # Socket.IO configuration
│   └── reactQuery.ts    # React Query configuration
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useMinio.ts      # MinIO hook
│   ├── useProducts.ts   # Products hook
│   └── useSocket.ts     # Socket.IO hook
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   └── products/       # Product pages
├── services/           # API services
│   ├── auth.ts         # Authentication service
│   ├── base.ts         # Base API service
│   └── product.ts      # Product service
├── store/              # State management
│   ├── types.ts        # Store types
│   └── useStore.ts     # Zustand store
├── types/              # Global TypeScript types
├── utils/              # Utility functions
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Features

- ⚡️ Vite + React + TypeScript
- 🎨 Shadcn UI + Tailwind CSS
- 🔄 React Query for data fetching
- 🔌 Socket.IO for real-time features
- 📦 MinIO for file storage
- 📱 Responsive design
- 🔒 Authentication with JWT
- 🎯 TypeScript for type safety
- 🐶 Husky for git hooks
- 📝 Commitlint for commit message validation

## Prerequisites

- Node.js 18+
- pnpm

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd react-base-ts
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env` file:

```env
VITE_API_URL=https://fakestoreapi.com

# MinIO Configuration
VITE_MINIO_ENDPOINT=localhost
VITE_MINIO_PORT=9000
VITE_MINIO_USE_SSL=false
VITE_MINIO_ACCESS_KEY=minioadmin
VITE_MINIO_SECRET_KEY=minioadmin
VITE_MINIO_BUCKET_NAME=products
VITE_MINIO_PUBLIC_URL=http://localhost:9000

# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:3000
```

4. Start development server:

```bash
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Key Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `minio` - Object storage
- `socket.io-client` - Real-time communication
- `zustand` - State management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation
- `react-hook-form` - Form handling
- `react-router-dom` - Routing
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `shadcn-ui` - UI components
- `husky` - Git hooks
- `@commitlint/cli` - Commit message linting

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages should be formatted as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests
- `build`: Changes to the build system
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify source or test files
- `revert`: Reverts a previous commit

### Examples

```
feat(auth): add login functionality
fix(api): handle network errors
docs(readme): update installation instructions
style(components): format code according to prettier
```

## Best Practices

- Use TypeScript for type safety
- Follow functional programming patterns
- Implement proper error handling
- Use React Query for data fetching
- Implement responsive design
- Follow component composition patterns
- Use proper naming conventions
- Implement proper loading states
- Handle edge cases
- Use proper form validation
- Follow commit conventions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes following the commit conventions
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

```

```
"# stream-platform-be" 
"# stream-platform-fe-customer" 
"# stream-platform-fe-customer" 
