// FilmLink — Prisma Seed File
// Run: npx prisma db seed
// Add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }

import { PrismaClient, UserType, UserStatus, Profession, ProjectType, CompensationType, ProjectStatus, EventType, EventStatus, ArticleStatus } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// Quick hash for dev — use bcrypt in production
const hash = (p: string) => createHash("sha256").update(p).digest("hex");

async function main() {
  console.log("🌱 Seeding FilmLink database...");

  // ── Admin ─────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@filmlink.com" },
    update: {},
    create: {
      email: "admin@filmlink.com",
      passwordHash: hash("admin1234"),
      userType: UserType.ADMIN,
      status: UserStatus.APPROVED,
      emailVerified: true,
      profile: {
        create: {
          firstName: "Film",
          lastName: "Link",
          displayName: "FilmLink Admin",
        },
      },
    },
  });

  // ── Sample Creative ───────────────────────────────
  const creative = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      passwordHash: hash("password123"),
      userType: UserType.CREATIVE,
      status: UserStatus.APPROVED,
      emailVerified: true,
      profile: {
        create: {
          firstName: "Jane",
          lastName: "Doe",
          profession: Profession.ACTOR,
          bio: "NYC-based actor with theatre and indie film experience.",
          city: "New York",
          state: "NY",
          country: "US",
          skills: {
            create: [
              { skill: "Improv" },
              { skill: "Stage Combat" },
              { skill: "Meisner Technique" },
            ],
          },
        },
      },
    },
  });

  // ── Sample Fan ────────────────────────────────────
  const fan = await prisma.user.upsert({
    where: { email: "fan@example.com" },
    update: {},
    create: {
      email: "fan@example.com",
      passwordHash: hash("password123"),
      userType: UserType.FAN,
      status: UserStatus.APPROVED,
      emailVerified: true,
      profile: {
        create: { firstName: "Alex", lastName: "Smith" },
      },
    },
  });

  // ── Sample Producer ───────────────────────────────
  const producer = await prisma.user.upsert({
    where: { email: "mike@example.com" },
    update: {},
    create: {
      email: "mike@example.com",
      passwordHash: hash("password123"),
      userType: UserType.CREATIVE,
      status: UserStatus.APPROVED,
      emailVerified: true,
      profile: {
        create: {
          firstName: "Mike",
          lastName: "Torres",
          profession: Profession.DIRECTOR,
          bio: "Independent filmmaker. Making gritty short films in Brooklyn.",
          city: "Brooklyn",
          state: "NY",
        },
      },
    },
  });

  // ── Sample Project ────────────────────────────────
  const project = await prisma.project.create({
    data: {
      posterId: producer.id,
      title: "The Last Bodega",
      description: "A 15-minute short film about a corner store owner facing gentrification in the Bronx.",
      projectType: ProjectType.SHORT_FILM,
      genre: "Drama",
      status: ProjectStatus.OPEN,
      city: "Bronx",
      state: "NY",
      shootStartDate: new Date("2026-05-01"),
      shootEndDate: new Date("2026-05-03"),
      auditionInstructions: "Submit a 2-minute self-tape performing a monologue of your choice.",
      publishedAt: new Date(),
      roles: {
        create: [
          {
            title: "Miguel (Lead)",
            profession: Profession.ACTOR,
            description: "Male-presenting, 50s–60s, plays the aging bodega owner. Must convey warmth and quiet dignity.",
            compensation: CompensationType.COPY_CREDIT_MEALS,
            ageRange: "50–65",
          },
          {
            title: "Cinematographer",
            profession: Profession.CINEMATOGRAPHER,
            description: "Looking for someone with at least 2 short films in portfolio.",
            compensation: CompensationType.PAID,
            compensationDetails: "$300/day",
          },
        ],
      },
    },
  });

  // ── Sample Event ──────────────────────────────────
  await prisma.event.create({
    data: {
      title: "Spring Filmmaker Mixer — NYC",
      description: "Monthly networking mixer for emerging filmmakers and creatives. Drinks, demos, and conversations.",
      eventType: EventType.MIXER,
      status: EventStatus.PUBLISHED,
      venue: "The Roxy Hotel",
      address: "2 Avenue of the Americas",
      city: "New York",
      state: "NY",
      startDate: new Date("2026-04-12T19:00:00Z"),
      endDate: new Date("2026-04-12T22:00:00Z"),
      isFree: false,
      ticketPrice: 15.0,
      capacity: 120,
      createdById: admin.id,
      publishedAt: new Date(),
    },
  });

  // ── Sample Article ────────────────────────────────
  await prisma.article.create({
    data: {
      authorId: admin.id,
      title: "10 Short Films You Need to Watch From Sundance 2026",
      slug: "10-short-films-sundance-2026",
      summary: "Our picks for the most memorable short-form work from this year's festival.",
      body: "<p>Sundance 2026 delivered another outstanding slate of short films...</p>",
      status: ArticleStatus.PUBLISHED,
      category: "Festival Coverage",
      tags: ["Sundance", "Short Films", "2026"],
      publishedAt: new Date(),
      isFeatured: true,
    },
  });

  // ── Sample Acting Class ────────────────────────────
  await prisma.actingClass.create({
    data: {
      title: "On-Camera Intensive",
      instructor: "Sarah Kim",
      school: "The New York Acting Studio",
      description: "8-week on-camera technique class for film and TV. Scene work, audition preparation, and cold reading.",
      schedule: "Wednesdays 7–10pm",
      city: "New York",
      state: "NY",
      price: 650,
      priceDescription: "per 8-week session",
      isActive: true,
      isVerifiedPartner: true,
    },
  });

  console.log("✅ Seed complete.");
  console.log(`   Admin:     admin@filmlink.com  / admin1234`);
  console.log(`   Creative:  jane@example.com   / password123`);
  console.log(`   Producer:  mike@example.com   / password123`);
  console.log(`   Fan:       fan@example.com    / password123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
