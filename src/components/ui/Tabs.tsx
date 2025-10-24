import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
    defaultValue: string
    className?: string
    children: ReactNode
}

interface TabsListProps {
    className?: string
    children: ReactNode
}

interface TabsTriggerProps {
    value: string
    className?: string
    children: ReactNode
}

interface TabsContentProps {
    value: string
    className?: string
    children: ReactNode
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
    return (
        <div className={cn('w-full', className)} data-default-value={defaultValue}>
            {children}
        </div>
    )
}

export function TabsList({ className, children }: TabsListProps) {
    return (
        <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500', className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                'data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm',
                className
            )}
            data-state="active"
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, className, children }: TabsContentProps) {
    return (
        <div className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2', className)}>
            {children}
        </div>
    )
}
