import Elysia from "elysia";
import { auth } from "@/lib/auth";

export const authRoutes = new Elysia().all("/auth/*", async (context) => {
	const { request } = context;
	if (["POST", "GET"].includes(request.method)) {
		return auth.handler(request);
	}
	context.status(405);
});
