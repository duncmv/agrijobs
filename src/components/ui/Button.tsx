import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
        const Comp = asChild ? 'div' : 'button'

        const getButtonStyle = () => {
            switch (variant) {
                case 'primary':
                    return { backgroundColor: '#d4b327', color: 'white' }
                case 'secondary':
                    return { backgroundColor: '#3B546E', color: 'white' }
                case 'outline':
                    return {
                        backgroundColor: 'transparent',
                        color: '#3B546E',
                        borderColor: '#3B546E'
                    }
                default:
                    return {}
            }
        }

        return (
            <Comp
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'shadow-md hover:shadow-lg': variant === 'primary' || variant === 'secondary',
                        'border-2 hover:bg-opacity-10': variant === 'outline',
                        'hover:bg-gray-100 text-gray-700': variant === 'ghost',
                    },
                    {
                        'h-8 px-3 text-sm': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6 text-lg': size === 'lg',
                    },
                    className
                )}
                style={getButtonStyle()}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
