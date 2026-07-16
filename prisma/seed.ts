import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create learning paths
  const paths = await Promise.all([
    prisma.learningPath.create({
      data: {
        title: "Web Security Fundamentals",
        slug: "web-security",
        description: "Master the OWASP Top 10 and learn to identify and exploit web vulnerabilities.",
        icon: "🌐",
        color: "#00f0ff",
        difficulty: "EASY",
        sortOrder: 1,
      },
    }),
    prisma.learningPath.create({
      data: {
        title: "Cryptography Essentials",
        slug: "cryptography",
        description: "From classical ciphers to modern encryption — understand the math behind security.",
        icon: "🔐",
        color: "#8b5cf6",
        difficulty: "MEDIUM",
        sortOrder: 2,
      },
    }),
    prisma.learningPath.create({
      data: {
        title: "Binary Exploitation",
        slug: "binary-exploitation",
        description: "Learn buffer overflows, format string bugs, and exploit development.",
        icon: "💻",
        color: "#ff6b6b",
        difficulty: "HARD",
        sortOrder: 3,
      },
    }),
    prisma.learningPath.create({
      data: {
        title: "Reverse Engineering",
        slug: "reverse-engineering",
        description: "Disassemble, analyze, and understand compiled programs.",
        icon: "🔬",
        color: "#ffd700",
        difficulty: "HARD",
        sortOrder: 4,
      },
    }),
    prisma.learningPath.create({
      data: {
        title: "Digital Forensics",
        slug: "forensics",
        description: "Analyze artifacts, recover data, and trace attacker movements.",
        icon: "🔍",
        color: "#22c55e",
        difficulty: "MEDIUM",
        sortOrder: 5,
      },
    }),
    prisma.learningPath.create({
      data: {
        title: "Network Security",
        slug: "network-security",
        description: "Packet analysis, network attacks, and defense strategies.",
        icon: "📡",
        color: "#3b82f6",
        difficulty: "MEDIUM",
        sortOrder: 6,
      },
    }),
  ]);

  // Create challenges for each path
  const challengeData = [
    // Web Security
    { title: "SQL Injection Basics", slug: "sqli-basics", path: "web-security", difficulty: "EASY", category: "Web Security", points: 100, xpReward: 50, entryFee: 0 },
    { title: "XSS reflected", slug: "xss-reflected", path: "web-security", difficulty: "EASY", category: "Web Security", points: 150, xpReward: 75, entryFee: 0 },
    { title: "CSRF Attack", slug: "csrf-attack", path: "web-security", difficulty: "MEDIUM", category: "Web Security", points: 200, xpReward: 100, entryFee: 0 },
    { title: "SSRF Exploitation", slug: "ssrf", path: "web-security", difficulty: "MEDIUM", category: "Web Security", points: 300, xpReward: 150, entryFee: 0 },
    { title: "File Upload Bypass", slug: "file-upload", path: "web-security", difficulty: "MEDIUM", category: "Web Security", points: 250, xpReward: 125, entryFee: 0 },
    { title: "Advanced Web Exploitation", slug: "advanced-web", path: "web-security", difficulty: "HARD", category: "Web Security", points: 500, xpReward: 250, entryFee: 10 },

    // Cryptography
    { title: "Caesar Cipher Decoder", slug: "caesar-cipher", path: "cryptography", difficulty: "EASY", category: "Cryptography", points: 100, xpReward: 50, entryFee: 0 },
    { title: "Base64 Challenges", slug: "base64", path: "cryptography", difficulty: "EASY", category: "Cryptography", points: 100, xpReward: 50, entryFee: 0 },
    { title: "RSA Key Recovery", slug: "rsa-recovery", path: "cryptography", difficulty: "HARD", category: "Cryptography", points: 500, xpReward: 250, entryFee: 15 },
    { title: "AES Decryption", slug: "aes-decryption", path: "cryptography", difficulty: "MEDIUM", category: "Cryptography", points: 300, xpReward: 150, entryFee: 0 },

    // Binary Exploitation
    { title: "Buffer Overflow 101", slug: "buffer-overflow-101", path: "binary-exploitation", difficulty: "MEDIUM", category: "Binary Exploitation", points: 250, xpReward: 125, entryFee: 0 },
    { title: "Format String Bug", slug: "format-string", path: "binary-exploitation", difficulty: "HARD", category: "Binary Exploitation", points: 400, xpReward: 200, entryFee: 10 },
    { title: "ROP Chain", slug: "rop-chain", path: "binary-exploitation", difficulty: "EXPERT", category: "Binary Exploitation", points: 750, xpReward: 400, entryFee: 25 },

    // Reverse Engineering
    { title: "ELF Binary Analysis", slug: "elf-analysis", path: "reverse-engineering", difficulty: "MEDIUM", category: "Reverse Engineering", points: 250, xpReward: 125, entryFee: 0 },
    { title: "Malware Analysis 101", slug: "malware-analysis", path: "reverse-engineering", difficulty: "HARD", category: "Reverse Engineering", points: 500, xpReward: 250, entryFee: 15 },
    { title: "Anti-Debug Bypass", slug: "anti-debug", path: "reverse-engineering", difficulty: "EXPERT", category: "Reverse Engineering", points: 750, xpReward: 400, entryFee: 25 },

    // Forensics
    { title: "PCAP Analysis", slug: "pcap-analysis", path: "forensics", difficulty: "EASY", category: "Forensics", points: 150, xpReward: 75, entryFee: 0 },
    { title: "Memory Forensics", slug: "memory-forensics", path: "forensics", difficulty: "HARD", category: "Forensics", points: 500, xpReward: 250, entryFee: 15 },

    // Network Security
    { title: "Wireshark Basics", slug: "wireshark-basics", path: "network-security", difficulty: "EASY", category: "Networking", points: 100, xpReward: 50, entryFee: 0 },
    { title: "Network Sniffing", slug: "network-sniffing", path: "network-security", difficulty: "MEDIUM", category: "Networking", points: 250, xpReward: 125, entryFee: 0 },
  ];

  for (const ch of challengeData) {
    const path = paths.find((p) => p.slug === ch.path);
    if (path) {
      await prisma.challenge.create({
        data: {
          title: ch.title,
          slug: ch.slug,
          description: `Solve this ${ch.difficulty.toLowerCase()} ${ch.category.toLowerCase()} challenge.`,
          difficulty: ch.difficulty as Difficulty,
          category: ch.category,
          points: ch.points,
          xpReward: ch.xpReward,
          entryFee: ch.entryFee,
          isFree: ch.entryFee === 0,
          timeLimitMin: ch.difficulty === "EASY" ? 30 : ch.difficulty === "MEDIUM" ? 60 : 120,
          learningPathId: path.id,
        },
      });
    }
  }

  // Create sample contests
  await prisma.contest.createMany({
    data: [
      {
        title: "Web Exploitation Arena",
        slug: "web-exploitation-arena",
        description: "Test your web security skills against real-world vulnerabilities.",
        entryFee: 25,
        prizePool: 500,
        commission: 20,
        difficulty: "MEDIUM",
        maxParticipants: 100,
        currentParticipants: 47,
        status: "ACTIVE",
        startDate: new Date("2026-07-15T10:00:00Z"),
        endDate: new Date("2026-07-20T18:00:00Z"),
        duration: 120,
        isFeatured: true,
      },
      {
        title: "Crypto Cracking Championship",
        slug: "crypto-cracking",
        description: "Break encryption algorithms and solve cryptographic puzzles.",
        entryFee: 50,
        prizePool: 1000,
        commission: 20,
        difficulty: "HARD",
        maxParticipants: 50,
        currentParticipants: 23,
        status: "UPCOMING",
        startDate: new Date("2026-07-25T20:00:00Z"),
        endDate: new Date("2026-07-28T20:00:00Z"),
        duration: 180,
        isFeatured: true,
      },
      {
        title: "Beginner's CTF",
        slug: "beginners-ctf",
        description: "Perfect for newcomers. Learn and compete in a friendly environment.",
        entryFee: 5,
        prizePool: 100,
        commission: 20,
        difficulty: "EASY",
        maxParticipants: 200,
        currentParticipants: 89,
        status: "ACTIVE",
        startDate: new Date("2026-07-14T12:00:00Z"),
        endDate: new Date("2026-07-18T22:00:00Z"),
        duration: 120,
        isFeatured: false,
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log(`Created ${paths.length} learning paths`);
  console.log(`Created ${challengeData.length} challenges`);
  console.log("Created 3 sample contests");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
