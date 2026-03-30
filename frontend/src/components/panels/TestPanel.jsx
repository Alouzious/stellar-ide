import { TestTube2, CheckCircle, XCircle, Play } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useTest } from '@/hooks/useTest'
import { useTerminalStore } from '@/store/terminalStore'
import { clsx } from 'clsx'

export function TestPanel() {
  const { run } = useTest()
  const { isRunning, lines } = useTerminalStore()
  const [specificTest, setSpecificTest] = useState('')

  const runSpecific = () => {
    if (specificTest.trim()) {
      run(specificTest.trim())
    }
  }

  const testResults = lines.filter(l => l.text?.includes('test ') && (l.text.includes('ok') || l.text.includes('FAILED')))
  const passed = testResults.filter(r => r.text.includes('ok')).length
  const failed = testResults.filter(r => r.text.includes('FAILED')).length

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        size="sm"
        icon={TestTube2}
        loading={isRunning}
        onClick={() => run()}
        className="w-full justify-center"
      >
        {isRunning ? 'Running...' : 'Run All Tests'}
      </Button>

      {/* Run specific test */}
      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Run Specific Test</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={specificTest}
            onChange={(e) => setSpecificTest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSpecific()}
            placeholder="test_hello"
            className="flex-1 bg-bg-tertiary border border-bg-border rounded px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
          />
          <button
            onClick={runSpecific}
            disabled={!specificTest.trim() || isRunning}
            className="px-2.5 py-1.5 bg-accent-blue/20 text-accent-blue rounded text-xs hover:bg-accent-blue/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play size={11} />
          </button>
        </div>
      </div>

      {/* Test results */}
      {testResults.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-accent-green flex items-center gap-1">
              <CheckCircle size={11} /> {passed} passed
            </span>
            {failed > 0 && (
              <span className="text-xs text-accent-red flex items-center gap-1">
                <XCircle size={11} /> {failed} failed
              </span>
            )}
          </div>
          <div className="space-y-1">
            {testResults.map((r, i) => (
              <div
                key={i}
                className={clsx(
                  'flex items-center gap-2 px-2 py-1 rounded text-xs font-mono',
                  r.text.includes('ok') ? 'text-accent-green bg-accent-green/5' : 'text-accent-red bg-accent-red/5'
                )}
              >
                {r.text.includes('ok') ? <CheckCircle size={10} /> : <XCircle size={10} />}
                <span className="truncate">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
