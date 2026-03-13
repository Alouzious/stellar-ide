import { Github } from 'lucide-react'
import { clsx } from 'clsx'
import { githubLogin } from '@/api/auth'

export function GithubOAuthButton({ className }) {
  return (
    <button
      onClick={githubLogin}
      className={clsx(
        'flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-colors duration-150',
        'bg-[#24292e] text-white border border-[#30363d] hover:bg-[#2f363d] active:bg-[#161b22]',
        'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-bg-primary',
        className
      )}
    >
      <Github size={16} />
      <span>Sign in with GitHub</span>
    </button>
  )
}
