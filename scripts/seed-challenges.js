const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding challenges...");

  // Get learning paths for linking
  const webSecurity = await prisma.learningPath.findUnique({ where: { slug: "web-security-fundamentals" } });
  const crypto = await prisma.learningPath.findUnique({ where: { slug: "cryptography-essentials" } });
  const binary = await prisma.learningPath.findUnique({ where: { slug: "binary-exploitation" } });
  const network = await prisma.learningPath.findUnique({ where: { slug: "network-security" } });

  const challenges = [
    {
      title: "SQL Injection Login Bypass",
      slug: "sqli-login-bypass",
      description: "Bypass a vulnerable login form using SQL injection techniques. Extract the admin password from the database.",
      content: "## SQL Injection: Login Bypass\n\nYou are given a login form that directly interpolates user input into a SQL query.\n\n### Target\nA login page at `/target/login` with username and password fields.\n\n### Vulnerable Query\n```sql\nSELECT * FROM users WHERE username = '{input}' AND password = '{input}'\n```\n\n### Your Task\n1. Find a way to bypass authentication\n2. Log in as the admin user\n3. The flag is hidden in the admin dashboard\n\n### Hints\n- Try entering `admin' --` as the username\n- The `--` comments out the rest of the query\n- No password check occurs after the comment",
      difficulty: "EASY",
      category: "Web Security",
      points: 100,
      xpReward: 50,
      entryFee: 0,
      isFree: true,
      learningPathId: webSecurity?.id,
    },
    {
      title: "Reflected XSS Challenge",
      slug: "reflected-xss",
      description: "Find and exploit a reflected XSS vulnerability. Inject a script that extracts cookies from the victim's browser.",
      content: "## Reflected XSS\n\nA search page reflects user input without sanitization.\n\n### Target\n`/target/search?q=your_query`\n\n### Your Task\n1. Find the reflection point\n2. Craft a payload that executes JavaScript\n3. The flag appears when you can read `document.cookie`\n\n### Requirements\n- Your payload must be reflected in the page\n- JavaScript must execute in the browser\n- Use `<script>` tags or event handlers",
      difficulty: "EASY",
      category: "Web Security",
      points: 150,
      xpReward: 75,
      entryFee: 0,
      isFree: true,
      learningPathId: webSecurity?.id,
    },
    {
      title: "CSRF Token Forgery",
      slug: "csrf-token-forgery",
      description: "Exploit a CSRF vulnerability to perform an unauthorized action on behalf of an authenticated user.",
      content: "## CSRF Attack\n\nA web application has weak CSRF protection on its admin actions.\n\n### Target\n`/target/admin/delete-user`\n\n### Your Task\n1. Analyze the CSRF token generation\n2. Find a way to predict or bypass the token\n3. Craft a request that deletes a user account\n\n### Constraints\n- You cannot directly access the admin panel\n- You must exploit the CSRF vulnerability\n- The flag is revealed after successful exploitation",
      difficulty: "MEDIUM",
      category: "Web Security",
      points: 200,
      xpReward: 100,
      entryFee: 0,
      isFree: true,
      learningPathId: webSecurity?.id,
    },
    {
      title: "Caesar Cipher Decoder",
      slug: "caesar-cipher-decoder",
      description: "Decrypt a message encrypted with a Caesar cipher by brute-forcing all 26 possible shifts.",
      content: "## Caesar Cipher Challenge\n\nYou intercepted an encrypted message. Intelligence suggests it was encrypted with a Caesar cipher.\n\n### Encrypted Message\n`GUVF VF GUR SYNQXRC GUNG LBH SVYGU RNEGURe\n\n### Your Task\n1. Write a script to try all 26 shifts\n2. Identify the correct shift by looking for readable English\n3. Submit the decrypted message as the flag\n\n### Tips\n- Common English words: THE, AND, IS, IN, OF\n- The shift is between 1 and 25",
      difficulty: "EASY",
      category: "Cryptography",
      points: 100,
      xpReward: 50,
      entryFee: 0,
      isFree: true,
      learningPathId: crypto?.id,
    },
    {
      title: "Weak RSA Key Recovery",
      slug: "weak-rsa-key",
      description: "Recover a private key from a weak RSA implementation with small prime factors.",
      content: "## Weak RSA Challenge\n\nA server uses RSA encryption but with dangerously small prime numbers.\n\n### Given\n- Public key: `n = 3233, e = 17`\n- Encrypted message: `2790`\n\n### Your Task\n1. Factor `n` into `p` and `q`\n2. Calculate Euler's totient `phi(n)`\n3. Find the private key `d` where `d * e ≡ 1 (mod phi(n))`\n4. Decrypt the message\n\n### Formulas\n- `n = p * q`\n- `phi(n) = (p-1) * (q-1)`\n- `d = e^(-1) mod phi(n)`\n- `plaintext = ciphertext^d mod n`",
      difficulty: "MEDIUM",
      category: "Cryptography",
      points: 200,
      xpReward: 100,
      entryFee: 0,
      isFree: true,
      learningPathId: crypto?.id,
    },
    {
      title: "Buffer Overflow Exploit",
      slug: "buffer-overflow-exploit",
      description: "Exploit a stack-based buffer overflow to gain arbitrary code execution on a vulnerable binary.",
      content: "## Buffer Overflow Challenge\n\nA vulnerable program reads user input without bounds checking.\n\n### Binary Info\n- 64-bit ELF\n- NX disabled (executable stack)\n- No stack canary\n- ASLR disabled\n\n### Your Task\n1. Find the buffer overflow vulnerability\n2. Determine the offset to the return address\n3. Inject shellcode or use a ROP chain\n4. Get a shell and read the flag file\n\n### Steps\n1. Send a cyclic pattern to find the offset\n2. Overwrite the return address\n3. Redirect execution to your shellcode\n4. `cat /flag.txt`",
      difficulty: "HARD",
      category: "Binary Exploitation",
      points: 500,
      xpReward: 250,
      entryFee: 5,
      isFree: false,
      learningPathId: binary?.id,
    },
    {
      title: "ARP Spoofing Detection",
      slug: "arp-spoofing-detect",
      description: "Analyze a PCAP file to detect an ARP spoofing attack and identify the attacker.",
      content: "## Network Forensics: ARP Spoofing\n\nYou received a PCAP file from the network team. They suspect an ARP spoofing attack.\n\n### Given\n- PCAP file with 10,000 packets\n- Network range: 192.168.1.0/24\n\n### Your Task\n1. Identify duplicate MAC addresses for different IPs\n2. Find the attacker's IP and MAC\n3. Determine which traffic was intercepted\n4. Extract the exfiltrated data\n\n### Tools\n- Wireshark\n- tshark\n- Scapy",
      difficulty: "MEDIUM",
      category: "Networking",
      points: 300,
      xpReward: 150,
      entryFee: 0,
      isFree: true,
      learningPathId: network?.id,
    },
    {
      title: "Reverse Engineering: CrackMe",
      slug: "reverse-eng-crackme",
      description: "Reverse engineer a binary to find the hidden password that unlocks the flag.",
      content: "## Reverse Engineering: CrackMe\n\nA binary checks for a secret password. If correct, it reveals the flag.\n\n### Binary Info\n- 32-bit ELF, statically linked\n- No anti-debugging protections\n\n### Your Task\n1. Open the binary in a disassembler (Ghidra/IDA)\n2. Find the password comparison logic\n3. Determine the correct password\n4. Run the binary with the password to get the flag\n\n### Approach\n1. Look for `strcmp`, `strncmp`, or `memcmp` calls\n2. Trace back to find the expected string\n3. The password is compared character by character",
      difficulty: "HARD",
      category: "Reverse Engineering",
      points: 400,
      xpReward: 200,
      entryFee: 3,
      isFree: false,
      learningPathId: binary?.id,
    },
  ];

  let created = 0;
  for (const challenge of challenges) {
    const existing = await prisma.challenge.findUnique({ where: { slug: challenge.slug } });
    if (!existing) {
      await prisma.challenge.create({ data: challenge });
      created++;
      console.log(`  Created: ${challenge.title}`);
    } else {
      console.log(`  Skipped (exists): ${challenge.title}`);
    }
  }

  console.log(`\nDone! Created ${created} challenges.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
