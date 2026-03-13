import { Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'
import { notify } from '@/components/ui/Toast'
import { clsx } from 'clsx'

export function CodeSnippet({ code, language = 'typescript', label }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(code)
    setCopied(true)
    notify.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-bg-border overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-bg-secondary border-b border-bg-border">
          <span className="text-xs text-text-muted">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-accent-purple">{language}</span>
            <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors">
              {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      )}
      <pre className={clsx(
        'bg-bg-primary p-4 overflow-x-auto text-xs font-mono text-text-primary',
        'leading-relaxed max-h-80'
      )}>
        <code>{code}</code>
      </pre>
      {!label && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors"
        >
          {copied ? <CheckCircle size={12} className="text-accent-green" /> : <Copy size={12} />}
        </button>
      )}
    </div>
  )
}
