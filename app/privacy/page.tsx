import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - ProjectPulse",
  description: "Privacy policy for ProjectPulse - Your daily AI project ideas",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <nav className="border-b border-[#2a2a2a]/50 bg-[#1a1a1a]/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: March 25, 2026</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to ProjectPulse. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">We collect minimal information to provide our service:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Usage data (pages visited, features used)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Interaction data (likes, shares on ideas)</li>
              <li>Notification preferences (if you enable push notifications)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We do NOT collect personal information like names, emails, or phone numbers unless you explicitly provide them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and improve our service</li>
              <li>Send push notifications (only if you opt-in)</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Maintain security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage</h2>
            <p className="leading-relaxed">
              Your interaction data (likes, shares) is stored locally in your browser using localStorage. 
              This data never leaves your device unless you explicitly share content. Our service is serverless 
              and runs on GitHub Actions, with project ideas stored in a public GitHub repository.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and Local Storage</h2>
            <p className="leading-relaxed">
              We use browser localStorage to remember your preferences and liked ideas. We do not use tracking cookies 
              or third-party analytics that compromise your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Services</h2>
            <p className="leading-relaxed mb-4">ProjectPulse integrates with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>GitHub (for hosting and automation)</li>
              <li>Vercel/Netlify (for web hosting)</li>
              <li>Telegram Bot API (for bot functionality)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              These services have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your data (stored locally in your browser)</li>
              <li>Delete your data (clear browser storage)</li>
              <li>Opt-out of notifications (disable in browser settings)</li>
              <li>Request information about data we collect</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              ProjectPulse is not intended for children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy, contact us at:{" "}
              <a href="https://github.com/manusiele/projectpulse/issues" className="text-blue-400 hover:text-blue-300">
                GitHub Issues
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
