# Tea Study Buddy

A SvelteKit application that helps tea enthusiasts track and learn about their tea sessions with an interactive chat interface.

## Features

- Interactive chat interface for tea sessions
- Tea session tracking and management
- Real-time session information display
- Responsive and accessible design
- TypeScript support for enhanced development experience

## Tech Stack

- **Frontend Framework**: SvelteKit 2.x (Svelte 4.x)
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Package Manager**: PNPM 8.x
- **Node.js Version**: 18.x or later
- **Styling**: TailwindCSS

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable Svelte components
│   │   ├── Chat.svelte
│   │   ├── MessageInput.svelte
│   │   ├── MessageList.svelte
│   │   ├── TeaSessionInfo.svelte
│   │   └── TeaSessionList.svelte
│   ├── db/               # Database related code
│   ├── server/           # Server-side functionality
│   ├── stores/           # Svelte stores for state management
│   └── types.ts          # TypeScript type definitions
├── routes/
│   ├── api/             # API endpoints
│   ├── session/         # Session related routes
│   ├── +layout.svelte   # Root layout
│   └── +page.svelte     # Main page
└── app.html             # HTML template
```

## Getting Started

1. **Prerequisites**
   - Node.js 18.x or later
   - PNPM 8.x or later

2. **Installation**
   ```bash
   pnpm install
   ```

3. **Development**
   ```bash
   # Start development server
   pnpm dev

   # Start with browser open
   pnpm dev -- --open
   ```

4. **Building**
   ```bash
   # Create production build
   pnpm build

   # Preview production build
   pnpm preview
   ```

## Development Guidelines

- Use TypeScript for all new code
- Follow the component structure in `src/lib/components`
- Utilize Svelte stores for state management
- Implement proper TypeScript types for all components and functions
- Use TailwindCSS for styling
- Ensure accessibility features are implemented
- Write tests for new functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
