import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { clsx } from 'clsx'

export function Tooltip({ children, content, side = 'top', align = 'center', delayDuration = 400 }) {
  if (!content) return children

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={clsx(
              'z-[100] px-2.5 py-1.5 text-xs font-medium rounded',
              'bg-bg-panel border border-bg-border text-text-primary shadow-lg',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-bg-border" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
