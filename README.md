# Labster

A full-stack web application for biological sequence analysis, built with Rust backend and React frontend.

## Overview

Labster is designed for handling biological sequences (DNA/RNA) with a modern microservices-inspired architecture. The project features a Rust-based backend with PostgreSQL database and a React frontend with TypeScript.

## Technology Stack

### Backend
- **Rust** with Axum web framework
- **PostgreSQL** database with SQLx
- **Docker** containerization
- Custom CLI tools for database operations

### Frontend  
- **React 19** with TypeScript
- **TanStack Router** for file-based routing
- **TanStack Query** for server state management
- **Material-UI v7** components
- **TailwindCSS v4** for styling
- **Vite** build tool

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Nix (recommended) or manual tool installation

### Using Nix (Recommended)
```bash
nix develop
```
This provides all necessary tools: Rust toolchain, Node.js, PostgreSQL tools, sqlx-cli, just, etc.

### Manual Setup
Install the following tools:
- Rust (via rustup)
- Node.js 
- PostgreSQL
- sqlx-cli

### Running the Application
```bash
# Start all services (database, backend, frontend)
docker compose up

# Or using just
just start
```

The application will be available at:
- Frontend: http://localhost:5173 (development) or http://localhost:3010 (production)
- Backend API: http://localhost:3000

## Development

### Backend Development
```bash
cd backend

# Start development server
cargo run

# Database operations
cargo db create    # Create database
cargo db migrate   # Run migrations
cargo db seed      # Seed test data
cargo db drop      # Drop database

# Code generation
cargo generate

# Quality checks (recommended)
just all          # Run check, format, lint, and test
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run types
```

### Full Stack Commands
```bash
# Reset database completely
just reset-db

# Run all quality checks
just all
```

## Project Structure

```
labster/
├── backend/          # Rust workspace
│   ├── cli/         # Database and code generation tools
│   ├── config/      # Configuration management
│   ├── db/          # Database entities and migrations
│   ├── macros/      # Custom testing macros
│   └── web/         # Main web server (Axum)
├── frontend/        # React TypeScript SPA
├── testing/         # Testing utilities
└── .github/         # CI/CD workflows
```

## Database

The application uses PostgreSQL with SQLx for compile-time verified queries. Database operations are managed through custom CLI tools.

### Common Database Tasks
```bash
# Create and setup database
cargo db create
cargo db migrate

# Reset database with fresh data
just reset-db

# Development database connection
postgres://test:test@localhost/labster
```

## Testing

### Backend
```bash
cd backend
cargo test        # Run all tests
just test         # Run tests with just
```

### Frontend
```bash
cd frontend
npm test          # Run Vitest tests
npm run types     # Type checking
```

## Configuration

Configuration is managed through TOML files with environment variable overrides:
- `backend/config/app.toml` - Base configuration
- Environment variables override TOML settings
- Supports development/production/test environments

## Deployment

The project includes Docker configurations for both development and production:

- **Development**: `docker compose up`
- **Production**: Multi-stage Dockerfiles for optimized builds
- **CI/CD**: GitHub Actions with automated testing

## Contributing

1. Ensure all tests pass: `just all`
2. Follow existing code patterns and conventions
3. Use the provided CLI tools for database operations
4. Run type checking and linting before committing

## Architecture

The application follows a clean architecture pattern:

- **Frontend**: File-based routing with TanStack Router, server state management with TanStack Query
- **Backend**: Modular crate structure with clear separation of concerns
- **Database**: Migration-based schema management with entity definitions
- **Infrastructure**: Docker containerization with Nix development environment

For detailed development information, see [CLAUDE.md](CLAUDE.md).