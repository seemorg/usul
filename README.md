# Usul.ai Front-End

## Prerequisites

- [node.js v22.x](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Postgres](https://www.postgresql.org/download/)

## Setup

1. Start the api server `api.usul.ai`:

[GitHub repo](https://github.com/seemorg/api.usul.ai)

2. Start Postgres on your terminal:

on mac:
```bash
brew services start postgresql@15
```

3. Install dependencies with pnpm:

```bash
pnpm install
```

4. Generate the Prisma client:

```bash
pnpm db:generate
```

5. Start the development server:

```bash
pnpm dev
```
