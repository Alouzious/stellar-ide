import { useNavigate } from 'react-router-dom'
import { Rocket, Code2, Shield, Users, Package, Terminal, Zap, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GithubOAuthButton } from '@/components/auth/GithubOAuthButton'

const FEATURES = [
  { icon: Zap, title: 'Instant Compile', description: 'Compile Rust/Soroban contracts in seconds with cloud sandboxes', color: 'text-accent-yellow' },
  { icon: Shield, title: 'Security Audit', description: 'Run Scout security audits and get detailed vulnerability reports', color: 'text-accent-green' },
  { icon: Users, title: 'Live Collaboration', description: 'Code together in real-time with your team — like Google Docs for smart contracts', color: 'text-accent-purple' },
  { icon: Rocket, title: 'One-Click Deploy', description: 'Deploy to Testnet or Mainnet with a single click from the browser', color: 'text-accent-blue' },
  { icon: Package, title: 'Artifact Generator', description: 'Auto-generate TypeScript clients and ABI JSON for your contracts', color: 'text-accent-orange' },
  { icon: Terminal, title: 'Integrated Terminal', description: 'Watch build output, test results and deploy logs in real-time', color: 'text-accent-red' },
]

const STATS = [
  { label: 'Soroban Native', icon: Star },
  { label: 'Real-time Collab', icon: Users },
  { label: 'One-click Deploy', icon: Rocket },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans overflow-auto">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur border-b border-bg-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket size={20} className="text-accent-blue" />
          <span className="font-bold text-base">StellarIDE</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <Github size={18} />
          </a>
          <Button variant="outline" size="sm" onClick={() => navigate('/ide')}>
            Open IDE
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/30 rounded-full text-xs text-accent-blue mb-6">
          <Zap size={12} />
          Build Soroban Smart Contracts in the Browser
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          The IDE for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">
            Stellar / Soroban
          </span>
          <br />Smart Contract Devs
        </h1>

        <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
          Write, test, audit, and deploy Soroban contracts entirely in the browser.
          No local Rust toolchain needed. Powered by cloud sandboxes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            icon={Code2}
            onClick={() => navigate('/ide')}
            className="px-8 py-3 text-sm"
          >
            Open IDE Free
          </Button>
          <GithubOAuthButton />
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 border-y border-bg-border">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-10">
          {STATS.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon size={16} className="text-accent-blue" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Everything you need</h2>
          <p className="text-text-secondary text-center mb-12">to build production-ready Soroban contracts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="bg-bg-secondary border border-bg-border rounded-xl p-6 hover:border-accent-blue/40 transition-colors duration-200"
              >
                <Icon size={28} className={`${color} mb-4`} />
                <h3 className="text-sm font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
          <p className="text-text-secondary mb-8">Start coding your first Soroban contract right now — no sign-up required.</p>
          <Button
            variant="primary"
            icon={Rocket}
            onClick={() => navigate('/ide')}
            className="px-10 py-3 text-sm"
          >
            Launch IDE
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border py-8 px-6 text-center text-xs text-text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Rocket size={12} className="text-accent-blue" />
          <span className="font-medium text-text-secondary">StellarIDE</span>
        </div>
        <p>Built for Soroban developers on Stellar Network</p>
      </footer>
    </div>
  )
}
