#!/usr/bin/env node

/**
 * BrainBlitz PostgreSQL Database Setup Script
 *
 * This script automates provisioning and configuring the PostgreSQL database
 * including schema creation via Prisma, extensions setup, seeding, and verification.
 * Supports cross-platform execution (Windows, macOS, Linux).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';
import readline from 'node:readline';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Resolve directory paths in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Print usage help
function printHelp() {
  console.log(`
🚀 BrainBlitz Database Setup Script

Usage:
  node scripts/setup-db.js [options]

Options:
  -f, --force          Bypass confirmation prompts (useful for CI/CD or non-interactive environments)
  -s, --seed           Automatically seed the database after schema creation
  -c, --clean          Recreate the database if it already exists (WARNING: drops existing data)
  -e, --env <path>     Path to the environment file (default: .env)
  -h, --help           Show this help message
  `);
}

// Helper to ask user confirmation in terminal
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Check if CLI tool is available in environment
function checkCliTool(command) {
  try {
    const checkCmd = process.platform === 'win32' ? `where ${command}` : `which ${command}`;
    execSync(checkCmd, { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync(`${command} --version`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

// Run an external command streaming output in real-time
function runCommand(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️ Running command: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      env: { ...process.env, ...env },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  // 1. Argument Parsing
  const args = process.argv.slice(2);
  let force = false;
  let seed = false;
  let clean = false;
  let envPath = path.join(projectRoot, '.env');

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--force' || arg === '-f') {
      force = true;
    } else if (arg === '--seed' || arg === '-s') {
      seed = true;
    } else if (arg === '--clean' || arg === '-c') {
      clean = true;
    } else if (arg === '--env' || arg === '-e') {
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        envPath = path.isAbsolute(nextArg) ? nextArg : path.resolve(process.cwd(), nextArg);
        i++;
      } else {
        console.error('❌ Error: --env option requires a file path argument.');
        process.exit(1);
      }
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`❌ Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  const isInteractive = process.stdin.isTTY;
  if (!isInteractive && !force) {
    console.log('🤖 Non-interactive environment detected. Bypassing prompts (defaulting to safe behaviors).');
  }

  console.log('📋 Starting pre-flight checks...');

  // 2. Pre-flight CLI Checks
  const nodeOk = checkCliTool('node');
  const npmOk = checkCliTool('npm');
  const npxOk = checkCliTool('npx');
  const psqlOk = checkCliTool('psql');

  if (!nodeOk || !npmOk || !npxOk) {
    console.error('❌ Error: Missing required system dependencies (Node.js, npm, or npx). Please install them.');
    process.exit(1);
  } else {
    console.log('  ✅ Node.js, npm, and npx are installed.');
  }

  if (!psqlOk) {
    console.log('  ⚠️ Warning: "psql" CLI is not detected in PATH. (Optional, database operations will continue using Node client)');
  } else {
    console.log('  ✅ psql CLI is available.');
  }

  // 3. Environment Setup & Validation
  // If .env is missing, check if we can copy from .env.example
  if (envPath === path.join(projectRoot, '.env') && !fs.existsSync(envPath)) {
    const envExamplePath = path.join(projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      console.log('📝 .env file not found. Copying from .env.example...');
      try {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('  ✅ Copied .env.example to .env');
      } catch (err) {
        console.error(`❌ Failed to copy .env.example to .env: ${err.message}`);
      }
    } else {
      console.log('  ⚠️ Warning: Neither .env nor .env.example was found.');
    }
  }

  // Load variables into process.env
  if (fs.existsSync(envPath)) {
    console.log(`🔌 Loading environment variables from: ${envPath}`);
    dotenv.config({ path: envPath });
  }

  // Determine DATABASE_URL
  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('🔌 DATABASE_URL not found in environment. Attempting to build from individual variables...');
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : '';
    const dbName = process.env.DB_NAME || 'brainblitz';
    databaseUrl = `postgresql://${user}${password}@${host}:${port}/${dbName}`;
    process.env.DATABASE_URL = databaseUrl;
  }

  // Parse connection details
  let parsedUrl;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch (err) {
    console.error(`❌ Error: Invalid DATABASE_URL configuration: ${databaseUrl}`);
    process.exit(1);
  }

  const dbUser = parsedUrl.username || 'postgres';
  const dbPassword = parsedUrl.password;
  const dbHost = parsedUrl.hostname || 'localhost';
  const dbPort = parsedUrl.port || '5432';
  const dbName = parsedUrl.pathname.replace(/^\//, '') || 'brainblitz';

  console.log(`🔍 Connection Details:\n  Host: ${dbHost}\n  Port: ${dbPort}\n  User: ${dbUser}\n  Database: ${dbName}\n`);

  // Detect if target is Production
  const isProductionHost = !['localhost', '127.0.0.1'].includes(dbHost);
  const isProductionEnv = process.env.NODE_ENV === 'production';
  const isProd = isProductionHost || isProductionEnv;

  if (isProd) {
    console.log('🚨 WARNING: Target database appears to be a PRODUCTION environment.');
    if (clean && !force) {
      console.error('❌ Error: Recreating/cleaning a production database is blocked unless --force is specified.');
      process.exit(1);
    }
  }

  // 4. Connect to default database to verify/provision target DB
  const systemUrl = new URL(databaseUrl);
  systemUrl.pathname = '/postgres'; // Connect to default postgres DB first

  const pgSystemClient = new Client({
    host: dbHost,
    port: Number(dbPort),
    user: dbUser,
    password: dbPassword || '',
    database: 'postgres',
  });

  try {
    await pgSystemClient.connect();
    console.log('🔌 Connected to PostgreSQL default system database.');
  } catch (err) {
    console.error(`❌ Error: Failed to connect to default database: ${err.message}`);
    console.error('Please make sure PostgreSQL is running and credentials are correct.');
    process.exit(1);
  }

  // Check if target database exists
  let dbExists = false;
  try {
    const res = await pgSystemClient.query(
      'SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS exists',
      [dbName]
    );
    dbExists = res.rows[0]?.exists || false;
  } catch (err) {
    console.error(`❌ Error checking database existence: ${err.message}`);
    await pgSystemClient.end();
    process.exit(1);
  }

  let shouldCreateDb = !dbExists;
  let shouldDropDb = false;

  if (dbExists) {
    console.log(`ℹ️ Database "${dbName}" already exists.`);
    if (clean) {
      if (isProd && !force) {
        console.error('❌ Error: Overwriting production database is blocked.');
        await pgSystemClient.end();
        process.exit(1);
      }

      let confirm = 'y';
      if (isInteractive && !force) {
        confirm = await askQuestion(`⚠️ WARNING: --clean is specified. Are you sure you want to recreate the database "${dbName}"? (This drops ALL existing tables and data) [y/N]: `);
      }

      if (confirm === 'y' || confirm === 'yes') {
        shouldDropDb = true;
        shouldCreateDb = true;
      } else {
        console.log('⏭️ Skipping database recreation. Proceeding with migration on existing database.');
      }
    } else {
      console.log('⏭️ Skipping database creation. Running migrations directly.');
    }
  }

  // Dropping DB if requested
  if (shouldDropDb) {
    console.log(`💥 Dropping database "${dbName}"...`);
    try {
      // Terminate any open connections to the target database first
      await pgSystemClient.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1 AND pid <> pg_backend_pid()
      `, [dbName]);

      await pgSystemClient.query(`DROP DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`  ✅ Database "${dbName}" dropped.`);
    } catch (err) {
      console.error(`❌ Failed to drop database "${dbName}": ${err.message}`);
      await pgSystemClient.end();
      process.exit(1);
    }
  }

  // Creating DB if missing or dropped
  if (shouldCreateDb) {
    console.log(`🏗️ Creating database "${dbName}"...`);
    try {
      await pgSystemClient.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`  ✅ Database "${dbName}" created successfully.`);
    } catch (err) {
      console.error(`❌ Failed to create database "${dbName}": ${err.message}`);
      await pgSystemClient.end();
      process.exit(1);
    }
  }

  // Ensure role/user exists and has correct privileges if user is custom
  if (dbUser && dbUser !== 'postgres') {
    try {
      const roleCheck = await pgSystemClient.query(
        'SELECT 1 FROM pg_roles WHERE rolname = $1',
        [dbUser]
      );
      if (roleCheck.rows.length === 0) {
        console.log(`👤 Creating PostgreSQL role "${dbUser}"...`);
        const passwordSql = dbPassword ? ` WITH PASSWORD '${dbPassword.replace(/'/g, "''")}'` : '';
        await pgSystemClient.query(`CREATE ROLE "${dbUser.replace(/"/g, '""')}" WITH LOGIN SUPERUSER${passwordSql}`);
        console.log(`  ✅ Role "${dbUser}" created.`);
      }

      console.log(`🔑 Granting database privileges on "${dbName}" to "${dbUser}"...`);
      await pgSystemClient.query(`ALTER DATABASE "${dbName.replace(/"/g, '""')}" OWNER TO "${dbUser.replace(/"/g, '""')}"`);
      console.log(`  ✅ Privileges granted.`);
    } catch (err) {
      console.log(`  ⚠️ Note: Could not manage role/owner privileges: ${err.message} (Skipping; assuming existing configuration is valid)`);
    }
  }

  await pgSystemClient.end();

  // 5. Connect to target database to enable extensions
  console.log(`🔌 Connecting to target database: "${dbName}"...`);
  const pgTargetClient = new Client({
    host: dbHost,
    port: Number(dbPort),
    user: dbUser,
    password: dbPassword || '',
    database: dbName,
  });

  try {
    await pgTargetClient.connect();
    console.log('🔌 Connected to target database.');

    console.log('🔌 Enabling database extensions ("uuid-ossp", "pgcrypto")...');
    await pgTargetClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pgTargetClient.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('  ✅ Extensions enabled.');
  } catch (err) {
    console.error(`❌ Failed to enable database extensions: ${err.message}`);
    await pgTargetClient.end().catch(() => {});
    process.exit(1);
  } finally {
    await pgTargetClient.end().catch(() => {});
  }

  // 6. Schema Setup via Prisma Migrations
  try {
    console.log('🚜 Running Prisma Migrations...');
    // deploy runs migrations in a production-safe way without prompting or modifying the schema (it uses the migration history)
    await runCommand('npx', ['prisma', 'migrate', 'deploy']);
    console.log('  ✅ Database schema migrations deployed successfully.');
  } catch (err) {
    console.error(`❌ Failed to deploy migrations: ${err.message}`);
    process.exit(1);
  }

  // 7. Seed Data
  let shouldSeed = seed;
  if (!seed && isInteractive && !force) {
    const confirmSeed = await askQuestion('\n🌱 Would you like to seed the database with initial categories and trivia questions? [y/N]: ');
    if (confirmSeed === 'y' || confirmSeed === 'yes') {
      shouldSeed = true;
    }
  }

  if (shouldSeed) {
    try {
      console.log('🌱 Seeding database...');
      await runCommand('npm', ['run', 'db:seed']);
      console.log('  ✅ Seeding complete.');
    } catch (err) {
      console.error(`❌ Seeding failed: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log('⏭️ Skipping database seed.');
  }

  // 8. Verification
  console.log('\n🔍 Verifying schema and checking row counts...');
  const pgVerifyClient = new Client({
    host: dbHost,
    port: Number(dbPort),
    user: dbUser,
    password: dbPassword || '',
    database: dbName,
  });

  try {
    await pgVerifyClient.connect();
    const tablesToCheck = ['User', 'Category', 'Question', 'Answer', 'Score'];
    const summary = [];

    for (const table of tablesToCheck) {
      try {
        const countRes = await pgVerifyClient.query(`SELECT COUNT(*)::integer FROM "${table}"`);
        const rowCount = countRes.rows[0].count;
        summary.push({
          'Table Name': table,
          'Status': '✅ Active',
          'Row Count': rowCount
        });
      } catch (err) {
        summary.push({
          'Table Name': table,
          'Status': `❌ Error: ${err.message}`,
          'Row Count': 0
        });
      }
    }

    console.log('\n📊 Database Verification Summary:');
    console.table(summary);

    const activeTables = summary.filter(s => s.Status.startsWith('✅')).length;
    if (activeTables === tablesToCheck.length) {
      console.log('\n🎉 SUCCESS: PostgreSQL database setup completed successfully! BrainBlitz is ready to run.');
    } else {
      console.warn('\n⚠️ WARNING: Database setup finished, but some tables failed verification check.');
    }
  } catch (err) {
    console.error(`❌ Verification query failed: ${err.message}`);
  } finally {
    await pgVerifyClient.end().catch(() => {});
  }
}

main().catch((err) => {
  console.error(`❌ Unexpected error in setup script: ${err.message}`);
  process.exit(1);
});
