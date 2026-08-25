# 🛠 Project Commands Cheat Sheet

This document lists all essential commands for running, building, testing, and managing the project.

---

## 📦 1. Installation & Dependencies

```bash
# Install all dependencies across the entire monorepo (frontend & backend)
pnpm install

# Add a root-level development dependency (e.g. Prettier, Husky)
pnpm add -D <package-name> -w

# Add a dependency to the frontend application
pnpm --filter frontend add <package-name>

# Add a dependency to the backend application
pnpm --filter backend add <package-name>
```

---

## 🐳 2. Docker & Database (PostgreSQL)

```bash
# Start PostgreSQL database container in background mode
docker-compose up -d

# Stop PostgreSQL database container
docker-compose down

# View logs from PostgreSQL container
docker-compose logs -f postgres
```

---

## 🗄 3. Prisma ORM (Database Migrations & Management)

```bash
# Create and apply a new database migration
pnpm --filter backend exec prisma migrate dev --name init

# Generate Prisma Client types (run after schema changes)
pnpm --filter backend exec prisma generate

# Open Prisma Studio (GUI database browser in browser at http://localhost:5555)
pnpm --filter backend exec prisma studio

# Reset database (deletes all data and re-runs migrations)
pnpm --filter backend exec prisma migrate reset
```

---

## 🚀 4. Development (Running Applications)

```bash
# Run Frontend development server (React + Vite at http://localhost:5173)
pnpm --filter frontend dev

# Run Backend development server (Next.js at http://localhost:3000)
pnpm --filter backend dev

# Run both Frontend and Backend concurrently (if configured in root package.json)
pnpm dev
```

---

## 🎨 5. Code Quality & Formatting (ESLint & Prettier)

```bash
# Check code formatting across the repository with Prettier
pnpm exec prettier --check .

# Automatically fix code formatting across the repository
pnpm exec prettier --write .

# Run ESLint check on Frontend
pnpm --filter frontend lint

# Run ESLint check on Backend
pnpm --filter backend lint

# Manually trigger lint-staged on staged git files
pnpm exec lint-staged
```

---

## 🏗 6. Build & Production

```bash
# Build Frontend for production
pnpm --filter frontend build

# Build Backend for production
pnpm --filter backend build

# Preview Frontend production build locally
pnpm --filter frontend preview

# Start Backend production server after build
pnpm --filter backend start
```

---

## 🔀 7. Git & CI/CD Workflow

```bash
# Check repository status
git status

# Stage all changed files for commit (triggers pre-commit hook automatically)
git add .

# Create a git commit (Husky & lint-staged will auto-format staged files)
git commit -m "feat: setup project structure"

# Push commits to remote repository
git push origin main
```
