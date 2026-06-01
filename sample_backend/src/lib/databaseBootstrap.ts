import { Client } from "pg";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { seedDatabase } from "./seedHelper.js";

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

async function syncCategoriesIfDirty(databaseUrl: string) {
  const client = new Client({
    connectionString: databaseUrl,
  });
  try {
    await client.connect();
    
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Category'
      );
    `);
    
    if (checkTable.rows[0]?.exists) {
      const allowedCategories = ['Science', 'History', 'Geography', 'Mythology', 'Art', 'Animals'];
      const res = await client.query(`
        SELECT name FROM "Category";
      `);
      const existingCategories = res.rows.map((row: any) => row.name);
      
      const hasExtra = existingCategories.some((cat: string) => !allowedCategories.includes(cat));
      const hasMissing = allowedCategories.some((cat: string) => !existingCategories.includes(cat));
      
      let questionCount = 0;
      try {
        const qCheck = await client.query(`
          SELECT COUNT(*)::integer FROM "Question";
        `);
        questionCount = qCheck.rows[0]?.count || 0;
      } catch (qErr) {
        console.warn("⚠️ Failed to check Question count, defaulting to 0:", qErr);
      }
      
      if (hasExtra || hasMissing || questionCount < 360) {
        console.log(`⚠️ Database categories/questions are out of sync (expected 360 questions, found ${questionCount}). Triggering seeding...`);
        await seedDatabase();
        console.log("  ✅ Seeding complete. Database categories are now in sync.");
      } else {
        console.log("  ✅ Database categories and questions are in sync.");
      }
    }
  } catch (error) {
    console.warn("⚠️ Warning: Failed to verify/sync database categories:", error);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function runMigrations(databaseUrl: string) {
  // Pre-emptively clear any failed migrations in _prisma_migrations so Prisma doesn't block deployment
  try {
    const client = new Client({
      connectionString: databaseUrl,
    });
    await client.connect();
    
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations'
      );
    `);
    
    if (checkTable.rows[0]?.exists) {
      console.log("🧹 Checking for failed migrations in _prisma_migrations...");
      const deleteRes = await client.query(`
        DELETE FROM _prisma_migrations WHERE finished_at IS NULL;
      `);
      if (deleteRes.rowCount && deleteRes.rowCount > 0) {
        console.log(`  🗑️ Cleared ${deleteRes.rowCount} failed migration record(s) to unblock deployment.`);
      } else {
        console.log("  ✅ No failed migrations found.");
      }
    }
    await client.end().catch(() => undefined);
  } catch (error) {
    console.warn("⚠️ Warning: Failed to pre-clean _prisma_migrations table:", error);
  }

  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
  };

  const command = process.platform === "win32" ? "npx.cmd" : "npx";

  try {
    console.log("🚜 Running prisma migrate deploy...");
    await execFileAsync(command, ["prisma", "migrate", "deploy"], {
      env,
      cwd: process.cwd(),
      shell: true
    });
    console.log("  ✅ Migrations deployed successfully.");
    
    await syncCategoriesIfDirty(databaseUrl);
  } catch (error) {
    console.warn("⚠️ Migration deploy failed. Database might be in a failed migration state. Attempting automatic reset...", error);
    try {
      await execFileAsync(command, ["prisma", "migrate", "reset", "--force"], {
        env,
        cwd: process.cwd(),
        shell: true
      });
      console.log("  ✅ Database reset and migrations applied successfully.");

      console.log("🌱 Seeding database after reset...");
      await seedDatabase();
      console.log("  ✅ Seeding complete.");
    } catch (resetError) {
      console.error("❌ Database reset/seeding failed:", resetError);
      throw resetError;
    }
  }
}

export async function ensureDatabaseReady(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  await createDatabaseIfMissing(databaseUrl);
  await runMigrations(databaseUrl);
}