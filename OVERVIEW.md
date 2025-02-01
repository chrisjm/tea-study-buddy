# Tea Study Buddy - Codebase Overview

This document provides a detailed overview of the Tea Study Buddy codebase structure and key files to assist with LLM code review and development.

## Core Technology Stack

- **Frontend**: SvelteKit 2.x with Svelte 4.x
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 3.x with typography and forms plugins
- **Database**: SQLite with Drizzle ORM
- **Testing**: Vitest (Unit) and Playwright (E2E)
- **Build Tool**: Vite 6.x
- **Package Manager**: PNPM 8.x
- **Node Version**: 18.x or later

## Key Configuration Files

### Root Directory Configuration

- `package.json`: NPM package definition with scripts and dependencies
- `svelte.config.js`: SvelteKit configuration including adapter and preprocessor settings
- `vite.config.ts`: Vite bundler configuration
- `tailwind.config.ts`: TailwindCSS configuration with typography and forms plugins
- `tsconfig.json`: TypeScript compiler configuration
- `drizzle.config.ts`: Database ORM configuration
- `.env` & `.env.example`: Environment variable configuration
- `.prettierrc` & `.prettierignore`: Code formatting rules
- `eslint.config.js`: ESLint configuration for code linting

## Project Structure Analysis

### Source Code (`src/`)

#### Components (`src/lib/components/`)
- `Chat.svelte`: Main chat interface component
- `MessageInput.svelte`: User input component for chat
- `MessageList.svelte`: Chat message display component
- `TeaSessionInfo.svelte`: Tea session details display
- `TeaSessionList.svelte`: List of tea sessions

#### Data Layer
- `src/lib/db/`: Database schema and queries
- `src/lib/stores/`: Svelte stores for state management
- `src/lib/types.ts`: TypeScript type definitions

#### Routing (`src/routes/`)
- `+page.svelte`: Main application page
- `+layout.svelte`: Root layout template
- `api/`: API endpoint handlers
- `session/`: Tea session related routes

## Development Tools

### Testing Infrastructure
- `playwright.config.ts`: E2E test configuration
- `e2e/`: End-to-end test directory
- Unit tests are co-located with source files

### Database Management
Available scripts:
```bash
pnpm db:push      # Push schema changes
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:studio    # Launch Drizzle Studio
```

### Code Quality Tools
- ESLint with TypeScript and Svelte plugins
- Prettier with Svelte and TailwindCSS plugins
- TypeScript for static type checking

## Important Development Commands

```bash
# Development
pnpm dev         # Start development server
pnpm build       # Create production build
pnpm preview     # Preview production build

# Testing
pnpm test        # Run all tests
pnpm test:unit   # Run unit tests
pnpm test:e2e    # Run E2E tests

# Code Quality
pnpm lint        # Run linting
pnpm format      # Format code
pnpm check       # Type check
```

## Key Dependencies

### Production
- `@sveltejs/kit`: SvelteKit framework
- `drizzle-orm`: Database ORM
- `better-sqlite3`: SQLite database driver
- `tailwindcss`: Utility-first CSS framework

### Development
- `@sveltejs/vite-plugin-svelte`: Vite integration
- `@tailwindcss/typography`: Typography plugin
- `@tailwindcss/forms`: Form styling plugin
- `drizzle-kit`: Database migration tools
- `vitest`: Unit testing framework
- `playwright`: E2E testing framework

## File Naming Conventions

- Svelte components: PascalCase with `.svelte` extension
- TypeScript files: camelCase with `.ts` extension
- Route files: SvelteKit conventions (`+page.svelte`, `+layout.svelte`)
- Test files: `.spec.ts` or `.test.ts` extension

## State Management

The application uses Svelte stores for state management, with stores organized in the `src/lib/stores/` directory. This provides a centralized and reactive state management solution.

## Database Schema

The application uses SQLite with Drizzle ORM. Database schema and migrations are managed through Drizzle Kit tools. The database file is `tea-study-buddy.db` in the root directory.

## Deployment

The project is configured with `@sveltejs/adapter-vercel` for deployment to Vercel, though it can be adapted for other platforms by changing the adapter in `svelte.config.js`.
