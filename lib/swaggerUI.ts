import { promises as fs } from "fs";
import { join } from "path";
import { createSwaggerSpec } from "next-swagger-doc";

const PUBLIC_PATH = join(process.cwd(), "public", "openapi.json");

const sharedSpecOptions = {
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IIoT API",
      version: "1.0.0",
      description: "Auto-generated OpenAPI documentation for IIoT backend.",
    },
    components: {},
  },
};

export async function getApiDocs() {
  if (process.env.NODE_ENV !== "production") {
    const spec = createSwaggerSpec(sharedSpecOptions);

    await fs.writeFile(PUBLIC_PATH, JSON.stringify(spec, null, 2), "utf8");
    console.log("📄 Swagger spec updated in development");

    return spec;
  }

  try {
    const raw = await fs.readFile(PUBLIC_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Could not load OpenAPI spec in production:", err);
    throw new Error("OpenAPI specification not found.");
  }
}
