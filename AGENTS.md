# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express application with MongoDB integration, containerized with Docker and orchestrated with Docker Compose. The project demonstrates full-stack development with Docker, including a REST API for user management.

### Key Technologies
- **Runtime**: Node.js 26 (Alpine)
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Container Orchestration**: Docker Compose
- **CI/CD**: Jenkins pipeline
- **Environment Management**: dotenv

## Core Commands

### Development
- `npm start` — Start the development server with auto-reload (`node --watch src/index.js`)
- `npm install` — Install dependencies
- `node src/index.js` — Run the application directly (without watch mode)

### Docker & Containers
- `docker build -t my-app:1.0 .` — Build the application Docker image using the Dockerfile
- `docker-compose up` — Start all services (MongoDB, Mongo Express UI, and the app) defined in docker-compose.yaml
- `docker-compose down` — Stop and remove all running containers
- `docker-compose up -d` — Start services in detached mode (background)

### Accessing Services (when Docker Compose is running)
- **Application API**: http://localhost:3001
- **Mongo Express UI** (MongoDB admin interface): http://localhost:8081
- **MongoDB**: mongoDB:27017 (internal to containers)

### Environment Configuration
- Configuration is loaded from `.env` file via dotenv
- Critical variables: `MONGO_URI`, `PORT`
- The Dockerfile sets default values: `MONGO_URI=mongodb://admin:password@mongoDB:27017`, `PORT=3001`
- When developing locally with Docker Compose, services use the internal network (e.g., `mongoDB` hostname resolves within the container network)

## Architecture

### Layered Architecture Pattern
The application follows a classic layered architecture with clear separation of concerns:

```
Routes → Controllers → Services → Repositories → Models → MongoDB
```

### Layer Breakdown

**Routes** (`src/routes/user.routes.js`)
- Defines HTTP endpoints and maps them to controller methods
- Currently only user routes at `/api/v1/users`

**Controllers** (`src/controllers/user.controller.js`)
- Handles HTTP request/response cycle
- Receives requests, delegates business logic to services, formats responses
- Does not contain business logic—only orchestration and response formatting

**Services** (`src/services/user.services.js`)
- Contains core business logic and validation rules
- Examples: checking if user exists before creation, validation of required fields
- Delegates data access to repositories

**Repositories** (`src/repositories/user.repository.js`)
- Single responsibility: database abstraction layer
- Encapsulates all Mongoose queries
- Makes it easy to swap MongoDB with another database without changing upper layers

**Models** (`src/model/user.model.js`)
- Mongoose schema definitions
- Currently only `User` model with fields: `username`, `email`, `password`
- All fields are required; email is unique

**Database** (`src/db/index.js`)
- Singleton connection handler for MongoDB
- Connects using `MONGO_URI` from environment
- Called during application startup in `index.js`

### Entry Points
- `src/index.js` — Main entry point; establishes database connection and starts the Express server
- `src/app.js` — Express app factory; sets up middleware (static files, JSON/URL parsing) and mounts routes
- `src/constant.js` — Currently minimal; reserved for application constants

## Adding New Features

### Adding a New API Endpoint
1. Create a new route in `src/routes/` (e.g., `product.routes.js`) following the user routes pattern
2. Create corresponding controller in `src/controllers/` with request handlers
3. Create service class in `src/services/` for business logic
4. Create repository class in `src/repositories/` for data access
5. Create Mongoose model in `src/model/`
6. Mount the route in `src/app.js` via `app.use()`

### Adding Database Models
- Define schema in `src/model/` directory
- Export the model using `mongoose.model()`
- Create repository and service classes that wrap the model

### Dependency Injection Pattern
- Controllers, services, and repositories use constructor or class-based dependency injection
- Example: `UserRepository` constructor accepts a Mongoose model as a parameter, allowing easy testing and swapping

## Docker Deployment Notes

### Service Dependencies
- The `my-app` service in `docker-compose.yaml` depends on `mongoDB` via the `depends_on` key
- MongoDB must be initialized with credentials before the app starts (`MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`)
- The app connects using these same credentials in the `MONGO_URI`

### Volumes
- MongoDB data is persisted in a named volume `mongo-data` to survive container restarts
- Local source code is **not** mounted as a volume in docker-compose.yaml; changes require rebuilding the image

### Public Assets
- Static files in the `public/` directory are served by Express at the root path
- Configured in `src/app.js` via `express.static()`

## Testing Notes

The `package.json` currently has a placeholder test script. When implementing tests:
- Follow the existing layered architecture by testing each layer independently
- Mock repositories in service tests
- Mock services in controller tests
- Use MongoDB test database or in-memory alternatives (e.g., `mongodb-memory-server`)

## Current Jenkins Pipeline

The `Jenkinsfile` defines three stages (Build, Test, Deploy) but only contains echo statements. It can be expanded to:
- Build the Docker image in the Build stage
- Run tests in the Test stage
- Push the image and orchestrate deployment in the Deploy stage
