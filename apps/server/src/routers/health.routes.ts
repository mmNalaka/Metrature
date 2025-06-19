import { Elysia } from "elysia";

// Track server start time for uptime reporting
const startTime = Date.now();

// Types for health check responses
type HealthStatus = "healthy" | "unhealthy" | "degraded";

interface ComponentHealth {
	status: HealthStatus;
	latencyMs?: number;
	message?: string;
}

interface ServiceStatus {
	status: "up" | "down" | "degraded";
	uptime: string;
	timestamp: string;
	version: string;
	services: Record<string, ComponentHealth>;
}

// Helper functions for health checks
async function checkDatabaseHealth(): Promise<ComponentHealth> {
	try {
		// This would be a real database check in production
		// For now we'll simulate a successful check
		return {
			status: "healthy",
			latencyMs: Math.floor(Math.random() * 10),
		};
	} catch (error) {
		return {
			status: "unhealthy",
			message:
				error instanceof Error ? error.message : "Unknown database error",
		};
	}
}

async function checkCacheHealth(): Promise<ComponentHealth> {
	try {
		// This would be a real cache check in production
		return {
			status: "healthy",
			latencyMs: Math.floor(Math.random() * 5),
		};
	} catch (error) {
		return {
			status: "unhealthy",
			message: error instanceof Error ? error.message : "Unknown cache error",
		};
	}
}

function getSystemInfo() {
	return {
		environment: process.env.NODE_ENV || "development",
		version: process.env.APP_VERSION || "1.0.0",
		nodeVersion: process.version,
		memoryUsage: process.memoryUsage(),
		cpuUsage: process.cpuUsage(),
	};
}

function formatUptime(seconds: number): string {
	const days = Math.floor(seconds / (3600 * 24));
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

export const healthRoutes = new Elysia().group("/health", (app) =>
	app
		// Basic health check - for load balancers and simple monitoring
		.get(
			"/",
			({ set }) => {
				set.headers = {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				};
				return { status: "OK" };
			},
			{
				detail: {
					tags: ["Health"],
					summary: "Basic health check",
					description:
						"Simple health check endpoint for load balancers and monitoring systems",
				},
			},
		)

		// Liveness probe - for Kubernetes/container orchestration
		.get(
			"/liveness",
			({ set }) => {
				set.headers = {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				};
				// Liveness just checks if the application is running
				return { status: "alive", timestamp: new Date().toISOString() };
			},
			{
				detail: {
					tags: ["Health"],
					summary: "Liveness probe",
					description:
						"Liveness check for container orchestration systems like Kubernetes",
				},
			},
		)

		// Readiness probe - for Kubernetes/container orchestration
		.get(
			"/readiness",
			async ({ set }) => {
				set.headers = {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				};

				// Check if application is ready to serve traffic
				// This could include checks for database connections, etc.
				const dbHealth = await checkDatabaseHealth();

				if (dbHealth.status === "unhealthy") {
					set.status = 503; // Service Unavailable
					return {
						status: "not ready",
						reason: "Database connection issue",
						timestamp: new Date().toISOString(),
					};
				}

				return {
					status: "ready",
					timestamp: new Date().toISOString(),
				};
			},
			{
				detail: {
					tags: ["Health"],
					summary: "Readiness probe",
					description:
						"Readiness check to verify if application is ready to serve traffic",
				},
			},
		)

		// Detailed health check - comprehensive system status
		.get(
			"/status",
			async ({ set }) => {
				set.headers = {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				};

				// Check critical services
				const [dbHealth, cacheHealth] = await Promise.all([
					checkDatabaseHealth(),
					checkCacheHealth(),
				]);

				const services = {
					database: dbHealth,
					cache: cacheHealth,
				};

				// Determine overall status based on service health
				let overallStatus: "up" | "down" | "degraded" = "up";
				if (Object.values(services).some((s) => s.status === "unhealthy")) {
					overallStatus = "down";
					set.status = 503; // Service Unavailable
				} else if (
					Object.values(services).some((s) => s.status === "degraded")
				) {
					overallStatus = "degraded";
					set.status = 207; // Multi-Status
				}

				// Build comprehensive status response
				const statusResponse: ServiceStatus = {
					status: overallStatus,
					uptime: formatUptime((Date.now() - startTime) / 1000),
					timestamp: new Date().toISOString(),
					version: process.env.APP_VERSION || "1.0.0",
					services,
				};

				return statusResponse;
			},
			{
				detail: {
					tags: ["Health"],
					summary: "Detailed system health status",
					description: "Comprehensive health check of all system components",
				},
			},
		)

		// System information - for diagnostics
		.get(
			"/info",
			({ set }) => {
				set.headers = {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				};

				return {
					...getSystemInfo(),
					uptime: formatUptime(process.uptime()),
					timestamp: new Date().toISOString(),
				};
			},
			{
				detail: {
					tags: ["Health"],
					summary: "System information",
					description: "Provides system information for diagnostic purposes",
				},
			},
		),
);
