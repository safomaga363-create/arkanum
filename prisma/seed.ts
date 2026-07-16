import { PrismaClient, Difficulty, LessonType, ContestStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.contestEntry.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.notification.deleteMany();

  // ===========================
  // LEARNING PATHS & LESSONS
  // ===========================

  // 1. Web Security Fundamentals
  const webSecurity = await prisma.learningPath.create({
    data: {
      title: "Web Security Fundamentals",
      slug: "web-security-fundamentals",
      description: "Master the OWASP Top 10. Learn to identify and exploit web vulnerabilities in a safe environment.",
      icon: "🌐",
      color: "#00f0ff",
      difficulty: "EASY",
      sortOrder: 1,
    },
  });

  const webLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: "Introduction to Web Security",
        slug: "intro-web-security",
        description: "Understanding the landscape of web application security.",
        content: `## What is Web Security?

Web security refers to the process of protecting websites and web applications from cyber threats. As a ethical hacker, you need to understand how attackers think.

### Key Concepts
- **Attack Surface**: All points where an unauthorized user can try to enter data
- **Vulnerability**: A weakness in the system that can be exploited
- **Exploit**: A method used to take advantage of a vulnerability
- **Payload**: The data or code sent to exploit a vulnerability

### The OWASP Top 10 (2024)
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging Failures
10. Server-Side Request Forgery

### Your Goal
As a white-hat hacker, you'll learn to find these vulnerabilities BEFORE malicious actors do.`,
        contentType: "TEXT",
        difficulty: "EASY",
        durationMin: 15,
        points: 100,
        xpReward: 50,
        sortOrder: 1,
        learningPathId: webSecurity.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "SQL Injection Fundamentals",
        slug: "sqli-fundamentals",
        description: "Learn the basics of SQL injection attacks and how to prevent them.",
        content: `## SQL Injection (SQLi)

SQL injection is one of the most common and dangerous web vulnerabilities. It occurs when user input is directly inserted into SQL queries without proper sanitization.

### How SQLi Works

Consider this login query:
\`\`\`sql
SELECT * FROM users WHERE username = '{input}' AND password = '{input}'
\`\`\`

If an attacker enters: \`' OR '1'='1\` as the username, the query becomes:
\`\`\`sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'anything'
\`\`\`

This returns ALL users, bypassing authentication!

### Types of SQLi
1. **In-band (Classic)**: Results visible directly
2. **Blind**: No direct output, infer from behavior
3. **Union-based**: Uses UNION SELECT to extract data
4. **Time-based**: Uses SLEEP() to infer data

### Prevention
- Use parameterized queries (Prepared Statements)
- Input validation and sanitization
- Principle of least privilege for DB users
- WAF (Web Application Firewall)`,
        contentType: "TEXT",
        difficulty: "EASY",
        durationMin: 25,
        points: 150,
        xpReward: 75,
        sortOrder: 2,
        learningPathId: webSecurity.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Cross-Site Scripting (XSS)",
        slug: "xss-fundamentals",
        description: "Understanding and exploiting XSS vulnerabilities.",
        content: `## Cross-Site Scripting (XSS)

XSS allows attackers to inject malicious scripts into web pages viewed by other users.

### Types of XSS

**1. Reflected XSS**
The malicious script is reflected off the server (e.g., in an error message or search result).

**2. Stored XSS**
The script is permanently stored on the target server (e.g., in a database, message forum).

**3. DOM-based XSS**
The vulnerability exists in client-side code rather than server-side code.

### Example Attack
\`\`\`javascript
<script>alert('XSS')</script>
\`\`\`

If this is injected into a comment field and rendered without sanitization, it executes in every user's browser.

### Prevention
- Content Security Policy (CSP)
- Input validation
- Output encoding
- HttpOnly cookies`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 25,
        points: 200,
        xpReward: 100,
        sortOrder: 3,
        learningPathId: webSecurity.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Cross-Site Request Forgery (CSRF)",
        slug: "csrf-attacks",
        description: "How CSRF attacks work and how to defend against them.",
        content: `## Cross-Site Request Forgery (CSRF)

CSRF attacks force authenticated users to execute unwanted actions on web applications.

### How CSRF Works
1. User logs into bank.com and receives a session cookie
2. User visits malicious-site.com
3. Malicious site sends a request to bank.com with the user's cookies
4. Bank.com processes the request as if it came from the user

### Example
\`\`\`html
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
\`\`\`

### Prevention
- CSRF tokens
- SameSite cookie attribute
- Checking Origin/Referer headers
- Double submit cookies`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 20,
        points: 200,
        xpReward: 100,
        sortOrder: 4,
        learningPathId: webSecurity.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Server-Side Request Forgery (SSRF)",
        slug: "ssrf-attacks",
        description: "Understanding SSRF and its impact on internal networks.",
        content: `## Server-Side Request Forgery (SSRF)

SSRF allows attackers to make the server perform requests to internal resources.

### How SSRF Works
1. Application fetches a URL provided by the user
2. Attacker provides a URL pointing to internal services
3. Server makes the request, exposing internal data

### Targets
- Internal APIs (127.0.0.1, localhost)
- Cloud metadata services (169.254.169.254)
- Internal databases
- File system (/etc/passwd)

### Prevention
- URL validation and whitelisting
- Disable unnecessary URL schemes
- Network segmentation
- Response validation`,
        contentType: "TEXT",
        difficulty: "HARD",
        durationMin: 25,
        points: 300,
        xpReward: 150,
        sortOrder: 5,
        learningPathId: webSecurity.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Practical: SQL Injection Lab",
        slug: "sqli-practical",
        description: "Hands-on practice with SQL injection techniques.",
        content: `## SQL Injection Practice Lab

### Challenge 1: Bypass Login
Target: A login form with SQL injection vulnerability.

**Steps:**
1. Enter \`admin' --\` in the username field
2. Enter anything in the password field
3. Observe how the comment characters (\`--\`) disable the password check

### Challenge 2: Extract Data
**Steps:**
1. Use UNION SELECT to extract data from other tables
2. Example: \`' UNION SELECT username, password FROM users --\`
3. Analyze the output to find sensitive data

### Challenge 3: Blind SQLi
**Steps:**
1. Use boolean-based blind SQLi
2. Example: \`' AND (SELECT LENGTH(password) FROM users WHERE username='admin') > 5 --\`
3. Use binary search to determine exact values

### Safety Notes
- Only practice in sandboxed environments
- Never attempt SQLi on real systems without authorization
- Document your findings for responsible disclosure`,
        contentType: "PRACTICAL",
        difficulty: "HARD",
        durationMin: 45,
        points: 500,
        xpReward: 250,
        sortOrder: 6,
        learningPathId: webSecurity.id,
      },
    }),
  ]);

  // 2. Cryptography Essentials
  const crypto = await prisma.learningPath.create({
    data: {
      title: "Cryptography Essentials",
      slug: "cryptography-essentials",
      description: "From classical ciphers to modern encryption. Understand the math behind security.",
      icon: "🔐",
      color: "#8b5cf6",
      difficulty: "MEDIUM",
      sortOrder: 2,
    },
  });

  const cryptoLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: "Introduction to Cryptography",
        slug: "intro-crypto",
        description: "The fundamentals of cryptographic systems.",
        content: `## What is Cryptography?

Cryptography is the practice of securing communication from adversaries. It's the backbone of digital security.

### Key Concepts
- **Plaintext**: The original readable message
- **Ciphertext**: The encrypted unreadable message
- **Key**: A secret value used to encrypt/decrypt
- **Algorithm**: The method used for encryption

### Types of Cryptography
1. **Symmetric**: Same key for encrypt and decrypt (AES, DES)
2. **Asymmetric**: Public/private key pairs (RSA, ECC)
3. **Hashing**: One-way functions (SHA-256, MD5)

### Kerckhoffs's Principle
A cryptographic system should be secure even if everything about the system, except the key, is public knowledge.`,
        contentType: "TEXT",
        difficulty: "EASY",
        durationMin: 20,
        points: 100,
        xpReward: 50,
        sortOrder: 1,
        learningPathId: crypto.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Classical Ciphers",
        slug: "classical-ciphers",
        description: "Learn about Caesar cipher, Vigenere, and other historical encryption methods.",
        content: `## Classical Ciphers

### Caesar Cipher
A simple substitution cipher where each letter is shifted by a fixed number.

**Encryption:** E(x) = (x + n) mod 26
**Decryption:** D(x) = (x - n) mod 26

**Example:** With shift of 3:
- A → D
- B → E
- HELLO → KHOOR

### Vigenere Cipher
Uses a keyword to determine the shift for each letter.

**Example:** Key = "KEY"
- Plaintext: HELLO
- Key:       KEYKE
- Ciphertext: RIJVS

### Breaking Classical Ciphers
- Frequency analysis
- Known plaintext attacks
- Brute force (for small key spaces)`,
        contentType: "TEXT",
        difficulty: "EASY",
        durationMin: 25,
        points: 150,
        xpReward: 75,
        sortOrder: 2,
        learningPathId: crypto.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Modern Symmetric Encryption",
        slug: "symmetric-encryption",
        description: "AES, DES, and how modern symmetric encryption works.",
        content: `## Symmetric Encryption

### AES (Advanced Encryption Standard)
- Block cipher with 128-bit blocks
- Key sizes: 128, 192, or 256 bits
- Currently the gold standard

### How AES Works
1. **Key Expansion**: Generate round keys from the main key
2. **Initial Round**: AddRoundKey
3. **Main Rounds** (9-13): SubBytes, ShiftRows, MixColumns, AddRoundKey
4. **Final Round**: SubBytes, ShiftRows, AddRoundKey

### Modes of Operation
- **ECB**: Electronic Code Book (insecure)
- **CBC**: Cipher Block Chaining (needs IV)
- **CTR**: Counter Mode (parallelizable)
- **GCM**: Galois/Counter Mode (authenticated)

### DES vs AES
- DES: 56-bit key (broken)
- 3DES: 168-bit key (deprecated)
- AES: 128-256 bit key (secure)`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 30,
        points: 200,
        xpReward: 100,
        sortOrder: 3,
        learningPathId: crypto.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "RSA Encryption",
        slug: "rsa-encryption",
        description: "Understanding public-key cryptography with RSA.",
        content: `## RSA Encryption

### How RSA Works
1. Choose two large primes p and q
2. Calculate n = p × q
3. Calculate φ(n) = (p-1)(q-1)
4. Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
5. Calculate d = e^(-1) mod φ(n)

**Public Key:** (e, n)
**Private Key:** (d, n)

### Encryption/Decryption
- **Encrypt:** c = m^e mod n
- **Decrypt:** m = c^d mod n

### Security
RSA security relies on the difficulty of factoring large numbers. With sufficient key size (2048+ bits), it remains secure.`,
        contentType: "TEXT",
        difficulty: "HARD",
        durationMin: 35,
        points: 300,
        xpReward: 150,
        sortOrder: 4,
        learningPathId: crypto.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Hashing and Digital Signatures",
        slug: "hashing-signatures",
        description: "SHA, MD5, HMAC, and digital signature schemes.",
        content: `## Hashing

### What is a Hash Function?
A one-way function that maps arbitrary data to fixed-size output.

### Common Hash Functions
- **MD5**: 128-bit (broken, don't use for security)
- **SHA-1**: 160-bit (deprecated)
- **SHA-256**: 256-bit (secure)
- **bcrypt**: Password hashing (slow by design)

### Digital Signatures
1. Hash the message
2. Encrypt the hash with private key
3. Receiver decrypts with public key
4. Receiver hashes the message and compares

### HMAC (Hash-based Message Authentication Code)
Combines a hash function with a secret key for authentication.`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 25,
        points: 200,
        xpReward: 100,
        sortOrder: 5,
        learningPathId: crypto.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Practical: Cryptography Challenges",
        slug: "crypto-practical",
        description: "Solve real cryptography challenges.",
        content: `## Cryptography Practice Lab

### Challenge 1: Caesar Cipher Decoder
Write a script to brute-force a Caesar cipher encrypted message.

### Challenge 2: RSA Key Recovery
Given a weak RSA implementation, recover the private key from the public key.

### Challenge 3: Hash Collision
Find two different inputs that produce the same SHA-1 hash.

### Challenge 4: Password Cracking
Use hashcat or John the Ripper to crack a bcrypt password hash.

### Tools to Use
- CyberChef (web-based)
- Python with hashlib
- Hashcat
- John the Ripper`,
        contentType: "PRACTICAL",
        difficulty: "HARD",
        durationMin: 60,
        points: 500,
        xpReward: 250,
        sortOrder: 6,
        learningPathId: crypto.id,
      },
    }),
  ]);

  // 3. Binary Exploitation
  const binary = await prisma.learningPath.create({
    data: {
      title: "Binary Exploitation",
      slug: "binary-exploitation",
      description: "Learn buffer overflows, format string bugs, and exploit development.",
      icon: "💻",
      color: "#ff6b6b",
      difficulty: "HARD",
      sortOrder: 3,
    },
  });

  const binaryLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: "Introduction to Binary Analysis",
        slug: "intro-binary",
        description: "Understanding how programs work at the binary level.",
        content: `## Binary Analysis Fundamentals

### What is Binary Analysis?
Examining compiled programs to understand their behavior without source code.

### Key Concepts
- **Executable formats**: ELF (Linux), PE (Windows), Mach-O (macOS)
- **Assembly language**: Low-level representation of machine code
- **Registers**: CPU's fastest storage locations
- **Stack**: LIFO data structure used for function calls
- **Heap**: Dynamic memory allocation area

### Tools
- **GDB**: GNU Debugger
- **objdump**: Disassembly tool
- **readelf**: ELF analysis
- **strace/ltrace**: System/library call tracing
- **Ghidra/IDA Pro**: Reverse engineering suites`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 25,
        points: 150,
        xpReward: 75,
        sortOrder: 1,
        learningPathId: binary.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Buffer Overflow Attacks",
        slug: "buffer-overflow",
        description: "Classic buffer overflow exploitation techniques.",
        content: `## Buffer Overflow

### How It Works
A buffer overflow occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory.

### Stack Buffer Overflow
1. Function pushes local variables onto stack
2. Return address is stored after local variables
3. Overflow overwrites return address
4. Attacker controls where execution goes

### Exploitation Steps
1. Find vulnerable buffer
2. Determine offset to return address
3. Craft payload with shellcode
4. Overwrite return address to point to shellcode

### Defense
- Stack canaries
- ASLR (Address Space Layout Randomization)
- DEP/NX (Data Execution Prevention)
- Safe coding practices`,
        contentType: "TEXT",
        difficulty: "HARD",
        durationMin: 35,
        points: 300,
        xpReward: 150,
        sortOrder: 2,
        learningPathId: binary.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Format String Vulnerabilities",
        slug: "format-string",
        description: "Understanding and exploiting format string bugs.",
        content: `## Format String Vulnerabilities

### What Are Format Strings?
Functions like printf() use format specifiers (%s, %x, %n) to control output.

### The Vulnerability
If user input is passed directly as the format string:
\`\`\`c
printf(user_input);  // VULNERABLE
printf("%s", user_input);  // SAFE
\`\`\`

### Exploitation
- **Read memory:** %x %x %x to leak stack values
- **Write memory:** %n to write arbitrary values
- **Target:** Overwrite GOT entries or return addresses

### Prevention
- Always use format string literals
- Validate user input
- Use compiler warnings`,
        contentType: "TEXT",
        difficulty: "HARD",
        durationMin: 30,
        points: 300,
        xpReward: 150,
        sortOrder: 3,
        learningPathId: binary.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Return-Oriented Programming (ROP)",
        slug: "rop-chains",
        description: "Advanced exploitation technique using existing code snippets.",
        content: `## Return-Oriented Programming (ROP)

### Why ROP?
Modern defenses prevent direct code injection (NX/DEP). ROP bypasses this by chaining existing code.

### How ROP Works
1. Find small code snippets (gadgets) ending in RET
2. Chain gadgets together to perform desired operations
3. Each gadget does one small task
4. RET instructions link gadgets together

### Finding Gadgets
- ROPgadget tool
- ropper
- Manual analysis with GDB

### Example Chain
1. gadget1: pop rdi; ret (set first argument)
2. gadget2: mov [rdi], rax; ret (write value)
3. gadget3: syscall; ret (make system call)`,
        contentType: "TEXT",
        difficulty: "EXPERT",
        durationMin: 45,
        points: 500,
        xpReward: 250,
        sortOrder: 4,
        learningPathId: binary.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Practical: Binary Exploitation Lab",
        slug: "binary-practical",
        description: "Hands-on binary exploitation challenges.",
        content: `## Binary Exploitation Practice

### Challenge 1: Stack Buffer Overflow
Exploit a simple buffer overflow to gain code execution.

### Challenge 2: Format String Write
Use format string vulnerability to modify a variable.

### Challenge 3: ROP Chain
Build a ROP chain to call system("/bin/sh").

### Environment
All challenges run in isolated Docker containers with:
- Ubuntu 22.04
- GCC with specific protections disabled
- GDB with GEF/PEDA extension
- Python for exploit development`,
        contentType: "PRACTICAL",
        difficulty: "EXPERT",
        durationMin: 90,
        points: 750,
        xpReward: 400,
        sortOrder: 5,
        learningPathId: binary.id,
      },
    }),
  ]);

  // 4. Network Security
  const network = await prisma.learningPath.create({
    data: {
      title: "Network Security",
      slug: "network-security",
      description: "Packet analysis, network attacks, and defense strategies.",
      icon: "📡",
      color: "#3b82f6",
      difficulty: "MEDIUM",
      sortOrder: 4,
    },
  });

  const networkLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: "Networking Fundamentals",
        slug: "networking-fundamentals",
        description: "TCP/IP, OSI model, and network protocols.",
        content: `## Networking Basics

### OSI Model
1. **Physical**: Cables, signals
2. **Data Link**: MAC addresses, switches
3. **Network**: IP addresses, routing
4. **Transport**: TCP/UDP, ports
5. **Session**: Connection management
6. **Presentation**: Encryption, compression
7. **Application**: HTTP, DNS, SMTP

### TCP vs UDP
- **TCP**: Reliable, connection-oriented
- **UDP**: Fast, connectionless

### Key Protocols
- HTTP/HTTPS (80/443)
- SSH (22)
- DNS (53)
- SMTP (25)
- FTP (21)`,
        contentType: "TEXT",
        difficulty: "EASY",
        durationMin: 20,
        points: 100,
        xpReward: 50,
        sortOrder: 1,
        learningPathId: network.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Wireshark and Packet Analysis",
        slug: "wireshark-analysis",
        description: "Learn to capture and analyze network traffic.",
        content: `## Wireshark

### What is Wireshark?
A network protocol analyzer that captures and displays packet data.

### Key Features
- Live capture and offline analysis
- Rich display filter language
- Packet reassembly
- VOIP analysis
- Decryption support

### Basic Usage
1. Select network interface
2. Start capture
3. Apply display filters
4. Analyze packets

### Common Filters
- \`tcp.port == 80\` - HTTP traffic
- \`ip.addr == 192.168.1.1\` - Specific IP
- \`dns\` - DNS queries
- \`http.request.method == "POST"\` - HTTP POST`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 30,
        points: 200,
        xpReward: 100,
        sortOrder: 2,
        learningPathId: network.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Network Attacks",
        slug: "network-attacks",
        description: "ARP spoofing, MITM, and network-based attacks.",
        content: `## Network Attacks

### ARP Spoofing
- Send fake ARP messages
- Associate attacker's MAC with another host's IP
- Intercept traffic between victim and gateway

### Man-in-the-Middle (MITM)
- Position between two communicating parties
- Intercept and potentially modify traffic
- SSL stripping to downgrade HTTPS

### DNS Spoofing
- Redirect DNS queries to malicious server
- Phishing through legitimate-looking URLs

### Wireless Attacks
- Deauthentication attacks
- Evil twin access points
- WPA handshake capture`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 30,
        points: 250,
        xpReward: 125,
        sortOrder: 3,
        learningPathId: network.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Firewalls and IDS/IPS",
        slug: "firewalls-ids",
        description: "Understanding network defense mechanisms.",
        content: `## Network Defense

### Firewalls
- **Packet filtering**: Based on headers
- **Stateful inspection**: Track connection state
- **Application layer**: Deep packet inspection

### IDS/IPS
- **IDS** (Intrusion Detection System): Alerts on suspicious activity
- **IPS** (Intrusion Prevention System): Blocks suspicious activity

### Detection Methods
- Signature-based: Match known patterns
- Anomaly-based: Detect deviations from baseline
- Heuristic: Rule-based analysis

### Bypass Techniques (Educational)
- Fragmentation
- Encoding
- Encryption
- Timing attacks`,
        contentType: "TEXT",
        difficulty: "MEDIUM",
        durationMin: 25,
        points: 200,
        xpReward: 100,
        sortOrder: 4,
        learningPathId: network.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Practical: Network Analysis Lab",
        slug: "network-practical",
        description: "Analyze real network traffic and identify attacks.",
        content: `## Network Analysis Practice

### Exercise 1: PCAP Analysis
Analyze a PCAP file to identify:
- HTTP requests and responses
- DNS queries
- Suspicious connections
- Potential data exfiltration

### Exercise 2: ARP Spoofing Detection
Set up a controlled ARP spoofing scenario and detect it using:
- ARP tables
- Wireshark
- Network monitoring tools

### Exercise 3: Wireshark Challenge
Find the hidden flag in a provided PCAP file by following TCP streams and analyzing protocols.`,
        contentType: "PRACTICAL",
        difficulty: "MEDIUM",
        durationMin: 45,
        points: 300,
        xpReward: 150,
        sortOrder: 5,
        learningPathId: network.id,
      },
    }),
  ]);

  console.log(`Created 4 learning paths with ${webLessons.length + cryptoLessons.length + binaryLessons.length + networkLessons.length} lessons`);

  // ===========================
  // CONTESTS
  // ===========================

  await prisma.contest.createMany({
    data: [
      {
        title: "Beginner's Capture The Flag",
        slug: "beginners-ctf",
        description: "Perfect for newcomers! Solve easy challenges and win your first prize.",
        rules: "All challenges must be solved in the provided sandbox. No collaboration. Time limit: 2 hours.",
        entryFee: 5,
        prizePool: 100,
        commission: 20,
        difficulty: "EASY",
        maxParticipants: 200,
        currentParticipants: 0,
        status: "ACTIVE",
        startDate: new Date("2026-07-20T10:00:00Z"),
        endDate: new Date("2026-07-25T22:00:00Z"),
        duration: 120,
        isFeatured: false,
      },
      {
        title: "Web Exploitation Arena",
        slug: "web-exploitation-arena",
        description: "Test your web security skills against real-world vulnerabilities.",
        rules: "Challenges include SQLi, XSS, SSRF, and more. 2-hour time limit. Scoring based on difficulty and speed.",
        entryFee: 25,
        prizePool: 500,
        commission: 20,
        difficulty: "MEDIUM",
        maxParticipants: 100,
        currentParticipants: 0,
        status: "ACTIVE",
        startDate: new Date("2026-07-18T10:00:00Z"),
        endDate: new Date("2026-07-23T18:00:00Z"),
        duration: 120,
        isFeatured: true,
      },
      {
        title: "Cryptography Championship",
        slug: "crypto-championship",
        description: "Break encryption algorithms and solve cryptographic puzzles.",
        rules: "Classical and modern crypto challenges. 3-hour time limit. Bonus points for efficient solutions.",
        entryFee: 50,
        prizePool: 1000,
        commission: 20,
        difficulty: "HARD",
        maxParticipants: 50,
        currentParticipants: 0,
        status: "UPCOMING",
        startDate: new Date("2026-07-25T14:00:00Z"),
        endDate: new Date("2026-07-28T14:00:00Z"),
        duration: 180,
        isFeatured: true,
      },
      {
        title: "Binary Exploitation Masterclass",
        slug: "binary-exploitation-masterclass",
        description: "Advanced exploitation challenges for experienced hackers.",
        rules: "Buffer overflows, ROP chains, format strings. 4-hour time limit. Expert level only.",
        entryFee: 75,
        prizePool: 1500,
        commission: 20,
        difficulty: "EXPERT",
        maxParticipants: 30,
        currentParticipants: 0,
        status: "UPCOMING",
        startDate: new Date("2026-08-01T10:00:00Z"),
        endDate: new Date("2026-08-04T10:00:00Z"),
        duration: 240,
        isFeatured: false,
      },
      {
        title: "Weekend CTF Challenge",
        slug: "weekend-ctf",
        description: "Quick weekend competition. Mixed difficulty challenges.",
        rules: "Fun competition with mixed challenges. 4-hour time limit. Prizes for top 3.",
        entryFee: 10,
        prizePool: 200,
        commission: 20,
        difficulty: "MEDIUM",
        maxParticipants: 150,
        currentParticipants: 0,
        status: "ACTIVE",
        startDate: new Date("2026-07-19T10:00:00Z"),
        endDate: new Date("2026-07-21T18:00:00Z"),
        duration: 240,
        isFeatured: false,
      },
    ],
  });

  console.log("Created 5 contests");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
