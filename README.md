# Metrature (Meter + Future)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Metrature is an open-source platform for Billing, Metering, and Feature Flag management designed specifically for small to medium-sized projects. It provides a flexible, scalable solution for implementing usage-based pricing models, managing feature access, and streamlining billing operations.

## Why Metrature?

In today's software landscape, the ability to implement flexible pricing strategies and control feature access is crucial for sustainable growth. Metrature bridges this gap by offering:

- **Usage-based billing**: Track and monetize your application's usage metrics
- **Feature flag management**: Roll out features gradually or limit access based on subscription tiers
- **Subscription management**: Handle recurring billing with ease
- **Developer-friendly**: Well-documented APIs and SDKs for seamless integration

## Key Features

- **Metering Infrastructure**: Reliably capture and process usage events
- **Billing Management**: Convert usage data into billable items with customizable pricing rules
- **Feature Flags**: Control feature access with fine-grained permissions
- **User Management**: Manage customer accounts and their entitlements
- **Analytics Dashboard**: Visualize usage patterns and billing metrics
- **Multi-language SDKs**: Easy integration with various programming languages
- **Webhook Support**: Integrate with external payment providers and notification systems

## Technical Foundation

Built with a modern tech stack following clean architecture principles:

- RESTful API design with Echo framework
- Domain-driven design for maintainability and scalability
- Comprehensive logging and monitoring capabilities
- Flexible configuration management
- Designed for horizontal scaling

## Getting Started

*Documentation coming soon*

## Target Users

- SaaS products implementing usage-based pricing
- Developers needing feature flag capabilities
- Teams looking for an open-source alternative to paid metering/billing solutions
- Startups needing to quickly implement and iterate on pricing models

## Contributing

Metrature is an open-source project and contributions are welcome! Whether it's adding new features, improving documentation, or reporting bugs, your help makes Metrature better for everyone.

## License

MIT License




## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
bun db:push
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

The API is running at [http://localhost:3000](http://localhost:3000).



## Project Structure

```
metrature/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Elysia, NONE)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
- `bun check`: Run Biome formatting and linting
