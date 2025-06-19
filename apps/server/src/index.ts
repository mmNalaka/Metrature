import "dotenv/config";

import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { corsConfig } from "@/config/cors.config";
import { openapiHandler } from "@/lib/openapi";

import { authRoutes } from "@/routers/auth.routes";
import { healthRoutes } from "@/routers/health.routes";

const app = new Elysia()
	// Plugins
	.use(openapiHandler)
	.use(cors(corsConfig))

	// Routes
	.use(healthRoutes)
	.use(authRoutes)

	// Start Server
	.listen(3000, (s) => {
		console.info(`Server is running on http://${s.hostname}:${s.port}`);
		console.info(
			`Swagger is running on http://${s.hostname}:${s.port}/swagger`,
		);
	});
