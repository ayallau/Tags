#!/usr/bin/env node
/**
 * Rebuild all match scores - Batch job script
 * Usage: pnpm tsx src/scripts/rebuildMatches.ts
 */

import mongoose from "mongoose";
import config from "../config.js";
import { rebuildAllMatches } from "../services/userMatchService.js";

async function main() {
  try {
    console.log("=== Match Score Rebuild Tool ===\n");
    console.log(`Connecting to MongoDB at ${config.MONGO_URI}...`);

    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Run rebuild
    console.log("Starting rebuild process...\n");
    const startTime = Date.now();

    const result = await rebuildAllMatches({
      batchSize: 50,
      onProgress: (progress) => {
        const percent = ((progress.processed / progress.total) * 100).toFixed(
          1
        );
        console.log(
          `Progress: ${progress.processed}/${progress.total} (${percent}%)`
        );
      },
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n=== Rebuild Complete ===");
    console.log(`Total users: ${result.total}`);
    console.log(`Processed: ${result.processed}`);
    console.log(`Created: ${result.created}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Duration: ${duration}s\n`);

    // Close connection
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Error during rebuild:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
