import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
    className?: string
    children: ReactNode
}

export function Badge({ className, children }: BadgeProps) {
    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
            {children}
        </span>
    )
}
