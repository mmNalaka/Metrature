import { openAPI } from "better-auth/plugins";
import { auth } from "./auth";

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
	getPaths: (prefix = "/auth/api") =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					const operation = (reference[key] as any)[method];

					operation.tags = ["Auth"];
				}
			}

			return reference;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		}) as Promise<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
