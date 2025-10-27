#!/usr/bin/env node
/**
 * Seed users from seedUsers.json into MongoDB
 * Usage: pnpm tsx src/scripts/seedUsers.ts
 */

import mongoose from "mongoose";
import config from "../config.js";
import UserModel from "../models/User.js";
import TagModel from "../models/Tag.js";
import fs from "fs";
import path from "path";

// Path to seedUsers.json
const SEED_USERS_PATH = path.resolve(
  process.cwd().replace(/apps[\\/]server$/, ""),
  "devdocs/seedUsers.json"
);

// Bio templates for diversity
const BIO_TEMPLATES = [
  "Love traveling and exploring new cultures. Always up for an adventure!",
  "Passionate about {sport} and staying active. Looking for like-minded people.",
  "Tech enthusiast and coffee lover. Always learning something new.",
  "Foodie at heart, love cooking and trying new restaurants in town.",
  "Creative soul, passionate about {art}. Always working on a new project.",
  "Bookworm, cinephile, and amateur photographer. Let's share recommendations!",
  "Yoga practitioner and mindfulness advocate. Finding balance in daily life.",
  "Music lover and aspiring DJ. Looking for people to share the vibe with.",
  "Nature enthusiast and hiking addict. Weekend trails are my therapy.",
  "Fitness enthusiast and wellness coach. Motivated to help others reach their goals.",
];

// Fun facts for bios
const INTERESTS = [
  "running",
  "cycling",
  "photography",
  "painting",
  "music",
  "cooking",
  "yoga",
  "reading",
  "traveling",
  "gaming",
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBio(): string {
  const template = getRandomElement(BIO_TEMPLATES);
  const interest = getRandomElement(INTERESTS);

  let bio = template;
  // Replace placeholders
  bio = bio.replace("{sport}", interest);
  bio = bio.replace("{art}", interest);

  // Add personal touch
  if (Math.random() > 0.5) {
    const city = ["New York", "London", "Tel Aviv", "Tokyo", "Berlin", "Paris"][
      Math.floor(Math.random() * 6)
    ];
    bio += ` Based in ${city}.`;
  }

  return bio;
}

async function getCommonTags(count: number): Promise<string[]> {
  // Get all tags
  const allTags = await TagModel.find();

  // Create shared tag pools that will be common across users
  // We'll target specific slugs for commonality
  const popularTagSlugs = [
    "travel",
    "photography",
    "reading",
    "cooking",
    "gaming",
    "music",
    "movies",
    "yoga",
    "running",
    "fashion",
  ];

  const selected = new Set<string>();

  // First, add 1-3 popular tags that many users will share
  const popularCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < popularCount; i++) {
    const slug = getRandomElement(popularTagSlugs);
    const matchingTag = allTags.find(
      (tag) => tag.slug.toLowerCase() === slug.toLowerCase()
    );
    if (matchingTag && !selected.has(String(matchingTag._id))) {
      selected.add(String(matchingTag._id));
    }
  }

  // Then add random tags to complete the count
  while (selected.size < count) {
    const randomTag = getRandomElement(allTags);
    selected.add(String(randomTag._id));
  }

  return Array.from(selected);
}

interface SeedUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    city: string;
    country: string;
  };
  email: string;
  login: {
    username: string;
  };
  dob: {
    date: string;
  };
  picture: {
    large: string;
    medium: string;
  };
  registered: {
    date: string;
  };
}

async function seedUsers() {
  try {
    console.log("=== User Seeding Tool ===\n");
    console.log(`Connecting to MongoDB at ${config.MONGO_URI}...`);

    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log("✓ Connected to MongoDB\n");

    // Read seedUsers.json
    console.log(`Reading users from ${SEED_USERS_PATH}...`);
    const seedData = JSON.parse(fs.readFileSync(SEED_USERS_PATH, "utf-8"));
    const users = seedData.results as SeedUser[];
    console.log(`Found ${users.length} users to seed\n`);

    // Verify tags exist
    const tagCount = await TagModel.countDocuments();
    if (tagCount === 0) {
      console.error("❌ No tags found in database. Please run seedTags first!");
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`Available tags: ${tagCount}\n`);

    let created = 0;
    let skipped = 0;

    for (const userData of users) {
      // Check if user already exists
      const existing = await UserModel.findOne({
        $or: [
          { emailLower: userData.email.toLowerCase() },
          { username: userData.login.username },
        ],
      });

      if (existing) {
        console.log(`⊘ Skipping "${userData.login.username}" (already exists)`);
        skipped++;
        continue;
      }

      // Generate random online status (30% online)
      const isOnline = Math.random() < 0.3;

      // Calculate lastVisitAt (random time in last 7 days if not online)
      const lastVisitAt = isOnline
        ? new Date()
        : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      // Get 10 tags for this user (with some commonality)
      const userTags = await getCommonTags(10);

      // Generate bio
      const bio = generateBio();

      // Create user
      const user = new UserModel({
        emailLower: userData.email.toLowerCase(),
        username: userData.login.username,
        avatarUrl: userData.picture.large,
        photos: [userData.picture.large, userData.picture.medium],
        bio,
        location: `${userData.location.city}, ${userData.location.country}`,
        dateOfBirth: new Date(userData.dob.date),
        gender: userData.gender,
        title: userData.name.title,
        tags: userTags,
        isOnline,
        lastVisitAt,
        isOnboardingComplete: true,
        roles: ["user"],
      });

      await user.save();
      console.log(
        `✓ Created: "${userData.login.username}" with ${userTags.length} tags (${isOnline ? "online" : "offline"})`
      );
      created++;
    }

    console.log("\n=== Seeding Complete ===");
    console.log(`Created: ${created} users`);
    console.log(`Skipped: ${skipped} users (already existed)`);
    console.log(`Total in database: ${await UserModel.countDocuments()}\n`);

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

seedUsers();
