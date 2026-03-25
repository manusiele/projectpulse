import Link from "next/link";

export const metadata = {
  title: "Terms of Service - ProjectPulse",
  description: "Terms of service for ProjectPulse - Your daily AI project ideas",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: March 25, 2026</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using ProjectPulse, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="leading-relaxed">
              ProjectPulse is a free, open-source platform that delivers AI-generated project ideas daily via 
              Telegram and a web dashboard. The service is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <p className="leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to disrupt or harm the service</li>
              <li>Not abuse the API or automated systems</li>
              <li>Respect rate limits and usage guidelines</li>
              <li>Not scrape or harvest data from the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
            <p className="leading-relaxed mb-4">
              ProjectPulse is open-source software licensed under the MIT License. The project ideas generated 
              are provided for inspiration and educational purposes.
            </p>
            <p className="leading-relaxed">
              You are free to use, modify, and build upon the ideas provided. However, we make no claims about 
              the originality or viability of any generated ideas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Content Disclaimer</h2>
            <p className="leading-relaxed mb-4">
              All project ideas are AI-generated and provided for informational purposes only. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accuracy or feasibility of ideas</li>
              <li>Market viability or profitability</li>
              <li>Originality or uniqueness</li>
              <li>Technical correctness of suggested stacks</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Always conduct your own research before pursuing any project idea.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              ProjectPulse and its creators shall not be liable for any direct, indirect, incidental, special, 
              or consequential damages resulting from your use of the service. This includes but is not limited to 
              loss of profits, data, or business opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Service Availability</h2>
            <p className="leading-relaxed">
              We strive to maintain 99% uptime but do not guarantee uninterrupted service. The service may be 
              temporarily unavailable due to maintenance, updates, or technical issues. We are not liable for 
              any downtime or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Privacy</h2>
            <p className="leading-relaxed">
              Your use of ProjectPulse is also governed by our{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
              . Please review it to understand how we handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Modifications to Service</h2>
            <p className="leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of the service at any time 
              without prior notice. We may also update these terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to terminate or suspend access to our service immediately, without prior 
              notice, for conduct that we believe violates these Terms of Service or is harmful to other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Kenya, without 
              regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, please contact us at:{" "}
              <a href="https://github.com/manusiele/projectpulse/issues" className="text-blue-400 hover:text-blue-300">
                GitHub Issues
              </a>
            </p>
          </section>

          <section className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Open Source Notice</h2>
            <p className="leading-relaxed">
              ProjectPulse is open-source software. You can view, fork, and contribute to the code on{" "}
              <a href="https://github.com/manusiele/projectpulse" className="text-blue-400 hover:text-blue-300">
                GitHub
              </a>
              . The MIT License applies to the codebase.
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
