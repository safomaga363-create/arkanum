import Link from "next/link";
import { Shield } from "lucide-react";

export default function EthicsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ARKANUM</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Ethics Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p>ARKANUM is dedicated to promoting ethical hacking and cybersecurity education. We believe in responsible disclosure and the protection of digital infrastructure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">White-Hat Only</h2>
            <p>ARKANUM is exclusively for white-hat (ethical) hacking. All challenges, competitions, and activities must be conducted:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>In isolated sandbox environments provided by the Platform</li>
              <li>With explicit authorization from the Platform</li>
              <li>In compliance with all applicable laws and regulations</li>
              <li>Without causing harm to real systems or users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Activities</h2>
            <p>The following activities are strictly prohibited on ARKANUM:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Attacking the ARKANUM platform infrastructure</li>
              <li>Attempting to access other users&apos; accounts without authorization</li>
              <li>Sharing exploit code that targets real-world systems</li>
              <li>Using skills learned on the platform for malicious purposes</li>
              <li>Participating in any form of cybercrime</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Responsible Disclosure</h2>
            <p>If you discover a vulnerability in the ARKANUM platform itself, please report it responsibly to security@arkanum.io. We commit to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Acknowledge receipt within 24 hours</li>
              <li>Provide a timeline for resolution</li>
              <li>Credit researchers who report valid vulnerabilities</li>
              <li>Never pursue legal action against good-faith security researchers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Safe Learning Environment</h2>
            <p>All challenges on ARKANUM are designed to be safe and educational:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Challenges run in isolated containers</li>
              <li>No real systems are at risk</li>
              <li>Difficulty levels are clearly marked</li>
              <li>Hints are available for learners</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Age Restriction</h2>
            <p>ARKANUM is restricted to users aged 18 and older. We do not knowingly collect information from minors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Enforcement</h2>
            <p>Violation of this Ethics Policy may result in account suspension or permanent ban. We reserve the right to report illegal activities to law enforcement authorities.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
            <p>For ethics-related inquiries, contact us at ethics@arkanum.io</p>
          </section>
        </div>
      </div>
    </div>
  );
}
