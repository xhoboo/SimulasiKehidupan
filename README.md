# Simulasi Kehidupan

A narrative life-simulation game. Start at birth and live through the years —
each turn brings new events, and every choice you make shapes the person you
become and the story you leave behind.

## Tech stack

- [Vite](https://vitejs.dev/) — build tooling and dev server
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/) for routing
- [TanStack Query](https://tanstack.com/query) for data/state

## Getting started

Requires [Node.js](https://nodejs.org/) (18+) and npm.

```sh
# Install dependencies
npm install

# Start the dev server with hot reload
npm run dev
```

The app runs at http://localhost:8080.

## Available scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the development server                  |
| `npm run build`     | Build for production                          |
| `npm run build:dev` | Build using the development mode              |
| `npm run preview`   | Preview the production build locally          |
| `npm run lint`      | Run ESLint                                    |

## Project structure

```
src/
  components/   Reusable UI and game components
  pages/        Top-level routes (Index, NotFound)
  hooks/        Custom React hooks
  lib/          Utilities and game logic
  main.tsx      App entry point
```

## Building for production

```sh
npm run build
```

The output is written to `dist/`, which can be served by any static host.
