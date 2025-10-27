#!/usr/bin/env node
/**
 * Seed 40 sample tags into MongoDB
 * Usage: pnpm tsx src/scripts/seedTags.ts
 */

import mongoose from "mongoose";
import config from "../config.js";
import TagModel from "../models/Tag.js";
import { normalizeSlug } from "../services/tagService.js";

const SAMPLE_TAGS = [
  // Technology & Programming
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Web Development",
  "Mobile Apps",
  "AI & Machine Learning",
  "Cybersecurity",
  "Cloud Computing",

  // Creative & Arts
  "Photography",
  "Graphic Design",
  "Music Production",
  "Painting",
  "Writing",
  "Digital Art",
  "Videography",
  "Film Making",
  "Creative Writing",

  // Sports & Fitness
  "Running",
  "Yoga",
  "Cycling",
  "Basketball",
  "Swimming",
  "Football",
  "Tennis",
  "Gym",
  "Marathon",
  "CrossFit",

  // Food & Cooking
  "Cooking",
  "Baking",
  "Food Photography",
  "Plant-Based",
  "Vegetarian",
  "Vegan",
  "Wine Tasting",
  "Cocktail Mixing",

  // Travel & Adventure
  "Travel",
  "Hiking",
  "Mountain Biking",
  "Camping",
  "Backpacking",
  "Solo Travel",
  "City Exploration",
  "Adventure Sports",

  // Learning & Education
  "Reading",
  "Languages",
  "Online Learning",
  "Science",
  "History",
  "Philosophy",
  "Self-Development",

  // Gaming & Entertainment
  "Gaming",
  "Board Games",
  "Movies",
  "Anime",
  "Comics",
  "Streaming",
  "Podcasts",

  // Business & Finance
  "Entrepreneurship",
  "Investing",
  "Personal Finance",
  "Real Estate",
  "Stock Trading",

  // Lifestyle
  "Minimalism",
  "Sustainable Living",
  "Meditation",
  "Productivity",
  "Time Management",
  "Fashion",
  "Home Decoration",

  // Social & Community
  "Social Activism",
  "Volunteering",
  "Community Building",
  "Networking",

  // Miscellaneous
  "DIY",
  "Gardening",
  "Pet Care",
  "Collecting",
  "Astronomy",
  "Journaling",
  "Chess",
];

async function seedTags() {
  try {
    console.log("=== Tag Seeding Tool ===\n");
    console.log(`Connecting to MongoDB at ${config.MONGO_URI}...`);

    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    console.log(`Preparing to add ${SAMPLE_TAGS.length} tags...\n`);

    let created = 0;
    let skipped = 0;

    for (const label of SAMPLE_TAGS) {
      const slug = normalizeSlug(label);

      // Check if tag already exists
      const existing = await TagModel.findOne({ slug });
      if (existing) {
        console.log(`⊘ Skipping "${label}" (already exists)`);
        skipped++;
        continue;
      }

      // Create new tag
      const tag = new TagModel({ label, slug });
      await tag.save();
      console.log(`✓ Created: "${label}" (slug: ${slug})`);
      created++;
    }

    console.log("\n=== Seeding Complete ===");
    console.log(`Created: ${created} tags`);
    console.log(`Skipped: ${skipped} tags (already existed)`);
    console.log(`Total in database: ${await TagModel.countDocuments()}\n`);

    // Close connection
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedTags();
