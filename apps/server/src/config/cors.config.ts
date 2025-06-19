import type { cors } from "@elysiajs/cors";

type CorsConfig = Parameters<typeof cors>[0];

export const corsConfig: CorsConfig = {
	origin: process.env.CORS_ORIGIN || "",
	methods: ["GET", "POST", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};
