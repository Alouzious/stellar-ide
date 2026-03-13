import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

export function Modal({ open, onClose, title, description, children, size = 'md', className }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50 animate-in fade-in-0" />
        <Dialog.Content
          className={clsx(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-bg-secondary border border-bg-border rounded-lg shadow-2xl',
            'w-full mx-4 p-6 focus:outline-none',
            'animate-in fade-in-0 zoom-in-95',
            sizes[size],
            className
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              {title && (
                <Dialog.Title className="text-text-primary font-semibold text-base">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-text-secondary text-sm mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                className="text-text-muted hover:text-text-primary transition-colors ml-4 flex-shrink-0"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
