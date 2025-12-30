import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Register tsx for loading TypeScript files
register("tsx", pathToFileURL("./"));

// Re-export the schema
export { schema } from "./src/schema.ts";
