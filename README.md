# 🛍️ Tienda UCN Web

E-commerce web application developed with Next.js 16, React 19, TypeScript and TailwindCSS.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Features](#features)

## 🔧 Prerequisites

Make sure you have installed on your system:

- **Node.js** >= 18.17.0 (latest LTS version recommended)
- **npm** >= 9.0.0
- **Git** to clone the repository
- **Backend API** - You need to clone and run the backend repository: [TiendaUcnApi](https://github.com/A-benites/TiendaUcnApi)

> ⚠️ **Important:** This frontend application requires the backend API to be running. Make sure to clone both repositories and start the backend before running this application.

## 🚀 Technologies Used

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Form Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Linting:** [ESLint](https://eslint.org/)
- **Git Hooks:** [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/)

## 🔒 Admin Route Protection & Auth

This project uses [NextAuth.js](https://next-auth.js.org/) for authentication and a custom middleware to protect all `/admin` routes:

- Only users with the `admin` role (from the backend JWT) can access `/admin` pages.
- Non-admins are redirected to the homepage.
- The middleware uses `NEXTAUTH_SECRET` and expects the backend JWT to include a `role` claim.

### Required .env variables

```
NEXT_PUBLIC_API_URL=your_api_url_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** The value for `NEXTAUTH_SECRET` must match the backend JWT secret for correct token validation.

### How it works

The file `middleware.ts` at the project root intercepts all `/admin` requests and checks the user's session token:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (pathname.startsWith("/admin")) {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token || token.user?.role !== "admin") {
			const url = req.nextUrl.clone();
			url.pathname = "/";
			return NextResponse.redirect(url);
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
```

If you need to change admin access logic, edit `middleware.ts`.

## 📦 Installation

### 1. Clone both repositories

**Backend (required first):**

```bash
git clone https://github.com/A-benites/TiendaUcnApi.git
cd TiendaUcnApi
# Follow the backend README for setup instructions
```

**Frontend:**

```bash
git clone https://github.com/A-benites/TiendaUcnWeb.git
cd TiendaUcnWeb
```

### 2. Install frontend dependencies:

```bash
npm install
```

## ⚙️ Configuration

1. **Create environment variables file:**

Copy the `.env.local` file to `.env` and configure the necessary variables:

```bash
cp .env.local .env
```

2. **Configure environment variables in `.env`:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> ⚠️ **Important:**
>
> - The `.env` file is NOT uploaded to the repository (it's in `.gitignore`)
> - Make sure the backend is running on the URL configured in `NEXT_PUBLIC_API_URL`
> - For local development, the backend should be at `http://localhost:5000/api`

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

1. **Build the application:**

```bash
npm run build
```

2. **Start the production server:**

```bash
npm run start
```

### Linting

To check for code errors:

```bash
npm run lint
```

## 📁 Project Structure

```
TiendaUcnWeb/
├── public/                 # Static files
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Main layout
│   │   ├── page.tsx       # Home page
│   │   └── products/      # Products page
│   │       ├── page.tsx   # Product catalog
│   │       └── loading.tsx # Loading state
│   ├── components/        # Reusable components
│   │   ├── common/        # Common components
│   │   │   └── ProductCard.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and helpers
│   │   └── utils.ts
│   ├── models/            # Interfaces and types
│   │   └── product.model.ts
│   ├── providers/         # Context providers
│   │   ├── axios-provider.tsx
│   │   └── query-provider.tsx
│   ├── services/          # API services
│   │   ├── base-api-service.ts
│   │   └── product.service.ts
│   ├── stores/            # Zustand stores
│   └── types/             # Global type declarations
│       └── global.d.ts
├── .env.local             # Environment variables template
├── .gitignore             # Files ignored by Git
├── commitlint.config.js   # Commitlint configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 📜 Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Starts the development server         |
| `npm run build`   | Builds the application for production |
| `npm run start`   | Starts the production server          |
| `npm run lint`    | Runs ESLint to check the code         |
| `npm run prepare` | Sets up Husky (runs automatically)    |

## ✨ Features

### Implemented

- ✅ **Product Catalog:** `/products` page with responsive grid
- ✅ **Product Search:** Real-time filter
- ✅ **Loading States:** Skeleton UI for better UX
- ✅ **Async State Management:** TanStack Query with cache
- ✅ **Reusable Components:** ProductCard with responsive design
- ✅ **API Service Layer:** Scalable architecture with BaseApiService
- ✅ **Commit Validation:** Conventional Commits with Husky

### In Development

- 🚧 **Authentication:** NextAuth.js (pending configuration)
- 🚧 **Shopping Cart:** Management with Zustand
- 🚧 **Backend API:** Product and order endpoints

## 🤝 Contributing

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) conventions.

### Allowed commit types:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting changes (doesn't affect code)
- `refactor:` Code refactoring
- `test:` Add or modify tests
- `chore:` Maintenance tasks

### Example:

```bash
git commit -m "feat: add category filter to catalog"
```

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)

## 📝 Important Notes

1. **Backend Required:** The application needs a backend running at `http://localhost:5000/api`
2. **Environment Variables:** Don't forget to configure your `.env` file before running
3. **Node Version:** It's recommended to use the latest LTS version of Node.js
4. **Git Hooks:** Commits will be automatically validated by Husky

## 📧 Contact

For any questions about the project, contact the development team.

---

Developed with ❤️ by the UCN team
