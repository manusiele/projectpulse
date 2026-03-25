import Link from "next/link";

export const metadata = {
  title: "About - ProjectPulse",
  description: "Learn about ProjectPulse - Your daily AI project ideas platform",
};

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">About ProjectPulse</h1>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What is ProjectPulse?</h2>
            <p className="leading-relaxed mb-4">
              ProjectPulse is a free, open-source platform that delivers AI-generated project ideas daily. 
              Every day at 10 AM EAT, our AI generates a fresh, actionable project idea complete with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>A clear problem statement</li>
              <li>Target audience identification</li>
              <li>Exact tech stack recommendations</li>
              <li>Deployment platform suggestions</li>
              <li>Market potential analysis</li>
              <li>Direct documentation links</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
            <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">GitHub Actions Trigger</h3>
                  <p className="text-sm text-slate-400">
                    Every day at 10 AM EAT, a GitHub Actions workflow automatically triggers on a fresh Ubuntu VM.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI Generation</h3>
                  <p className="text-sm text-slate-400">
                    Ollama runs phi3:mini locally to generate a project idea from 25 problem domains, using past context for continuity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Delivery</h3>
                  <p className="text-sm text-slate-400">
                    The idea is formatted and sent to Telegram, then saved to the repository for the web dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-400 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Archive</h3>
                  <p className="text-sm text-slate-400">
                    The updated history is committed back to the repository, creating a permanent archive of all ideas.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Why ProjectPulse?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">100% Free</h3>
                <p className="text-sm text-slate-400">
                  No subscriptions, no paywalls. Runs entirely on GitHub Actions&apos; free tier.
                </p>
              </div>

              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Open Source</h3>
                <p className="text-sm text-slate-400">
                  MIT licensed. Fork it, customize it, learn from it. The code is yours.
                </p>
              </div>

              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Privacy First</h3>
                <p className="text-sm text-slate-400">
                  No tracking, no analytics. Your data stays on your device.
                </p>
              </div>

              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Serverless</h3>
                <p className="text-sm text-slate-400">
                  Zero infrastructure costs. No servers to maintain or scale.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Tech Stack</h2>
            <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-2">Frontend</h3>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Next.js 15 (App Router)</li>
                    <li>• React 18</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Backend</h3>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Python 3.11</li>
                    <li>• Ollama (phi3:mini)</li>
                    <li>• GitHub Actions</li>
                    <li>• Telegram Bot API</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">PWA Features</h3>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Service Worker</li>
                    <li>• Offline Support</li>
                    <li>• Push Notifications</li>
                    <li>• App Shortcuts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Deployment</h3>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Vercel (Web)</li>
                    <li>• GitHub Actions (Bot)</li>
                    <li>• Git (Storage)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">The Creator</h2>
            <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
              <p className="leading-relaxed mb-4">
                ProjectPulse was built by{" "}
                <a 
                  href="https://manusiele-4efb8.web.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  @manusiele
                </a>
                , a Kenyan developer passionate about making AI-powered tools accessible to everyone.
              </p>
              <p className="leading-relaxed mb-4">
                The goal was simple: create a free, daily source of inspiration for developers and entrepreneurs 
                looking to build their next project. No paywalls, no tracking, just pure value.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Get Involved</h2>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Contribute on GitHub</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Found a bug? Have a feature idea? Contributions are welcome!
                </p>
                <a 
                  href="https://github.com/manusiele/projectpulse" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              </div>

              <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Join the Telegram Bot</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Get daily ideas delivered straight to your Telegram.
                </p>
                <a 
                  href="https://t.me/projectpulse_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  @projectpulse_bot
                </a>
              </div>
            </div>
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
