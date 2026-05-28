import { Client } from "pg";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function getDatabaseName(databaseUrl: string) {
  const parsedUrl = new URL(databaseUrl);
  const databaseName = decodeURIComponent(parsedUrl.pathname.replace(/^\//, ""));

  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name.");
  }

  return databaseName;
}

async function createDatabaseIfMissing(databaseUrl: string) {
  const targetUrl = new URL(databaseUrl);
  const databaseName = getDatabaseName(databaseUrl);
  targetUrl.pathname = "/postgres";

  const client = new Client({
    host: targetUrl.hostname || "localhost",
    port: targetUrl.port ? Number(targetUrl.port) : 5432,
    user: targetUrl.username || "postgres",
    password: targetUrl.password || "",
    database: "postgres",
  });

  try {
    await client.connect();

    const result = await client.query(
      "SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS exists",
      [databaseName]
    );

    if (!result.rows[0]?.exists) {
      await client.query(`CREATE DATABASE "${databaseName.replace(/"/g, '""')}"`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to create or access the BrainBlitz database: ${message}`);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function runMigrations(databaseUrl: string) {
  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
  };

  const command = process.platform === "win32" ? "npx.cmd" : "npx";

  await execFileAsync(command, ["prisma", "migrate", "deploy"], {
    env,
    cwd: process.cwd(),
    shell: true
  });
}

export async function ensureDatabaseReady(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  await createDatabaseIfMissing(databaseUrl);
  await runMigrations(databaseUrl);
}