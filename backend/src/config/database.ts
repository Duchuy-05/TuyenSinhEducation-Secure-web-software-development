import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";

export function loadDatabaseUrl(): string {
  const envPath = path.resolve(__dirname, "../../.env");
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }

  const url = process.env.MYSQL_URL;
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("MYSQL_URL is required but not configured");
  }

  return url.trim();
}
