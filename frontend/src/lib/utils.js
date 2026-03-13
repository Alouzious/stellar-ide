import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function truncateAddress(address, chars = 6) {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatXLM(amount) {
  if (amount === null || amount === undefined) return '0 XLM'
  return `${parseFloat(amount).toLocaleString(undefined, { maximumFractionDigits: 7 })} XLM`
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}

export function getFileLanguage(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map = {
    rs: 'rust',
    toml: 'toml',
    md: 'markdown',
    json: 'json',
    js: 'javascript',
    ts: 'typescript',
    txt: 'plaintext',
  }
  return map[ext] || 'plaintext'
}

export function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'rs') return 'fileCode'
  if (ext === 'toml' || ext === 'json') return 'settings'
  if (ext === 'md') return 'fileText'
  return 'file'
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeDate(date) {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const diff = now - then
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(date)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}
