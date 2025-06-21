import { registry } from "./schemas";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { createSwaggerSpec } from "next-swagger-doc";
import { promises as fs } from "fs";
import { join } from "path";

const PUBLIC_PATH = join(process.cwd(), "public", "openapi.json");

// Generacja schematów
const components = new OpenApiGeneratorV3(registry.definitions).generateComponents();

export async function getApiDocs() {
  // 1️⃣ Generuj spec tylko z parsowaniem ścieżek (endpointów)
  const specRaw = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "IIoT API Documentation",
        version: "0.0.1-beta",
        description: "Comprehensive API reference for Industrial IoT backend services",
      },
      // ≠ nie podawaj tu components.schemas ⛔
    },
  });

  // 2️⃣ Ręczne scalanie schematów
  const spec = {
    ...specRaw,
    components: {
      ...(specRaw.components || {}),
      schemas: components.schemas,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    await fs.writeFile(PUBLIC_PATH, JSON.stringify(spec, null, 2), "utf8");
    console.log("✅ Swagger spec zbudowany poprawnie");
  }

  return spec;
}
