import Link from "next/link";
import { Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ARKANUM</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using ARKANUM (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Age Requirement</h2>
            <p>You must be at least 18 years old to use ARKANUM. By using the Platform, you represent and warrant that you are at least 18 years of age.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p>You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Platform Usage</h2>
            <p>ARKANUM is a platform for competitive ethical hacking and cybersecurity education. You agree to use the Platform only for lawful purposes and in accordance with these Terms.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All challenges and competitions must be conducted in isolated sandbox environments</li>
              <li>You must not attempt to exploit or attack the Platform infrastructure itself</li>
              <li>You must not share account credentials with others</li>
              <li>You must not use automated tools to solve challenges unless explicitly permitted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payments and Financial Transactions</h2>
            <p>The Platform uses USDT (TRC20) as the primary payment method. All transactions are final once confirmed on the blockchain. The Platform reserves a commission on contest entry fees as displayed before payment.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Entry fees are non-refundable once a contest has started</li>
              <li>Withdrawal requests are processed within 24 hours</li>
              <li>The Platform charges a 1% fee on withdrawals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
            <p>All content, challenges, and materials on the Platform are the intellectual property of ARKANUM or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p>ARKANUM is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact</h2>
            <p>For questions about these Terms, contact us at support@arkanum.io</p>
          </section>
        </div>
      </div>
    </div>
  );
}
