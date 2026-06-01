import { seedDatabase } from "../src/lib/seedHelper.js";

async function main() {
  await seedDatabase();
}

main()
  .catch((error) => {
    console.error("Seed execution failed:", error);
    process.exit(1);
  });
