import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@sms-hub/utils'

const hubButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-hub-primary text-primary-foreground hover:bg-hub-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-hub-primary text-hub-primary hover:bg-hub-primary/10',
        secondary: 'bg-hub-secondary text-secondary-foreground hover:bg-hub-secondary/80',
        ghost: 'hover:bg-hub-primary/10 hover:text-hub-primary',
        link: 'text-hub-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface HubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hubButtonVariants> {
  asChild?: boolean
}

const HubButton = React.forwardRef<HTMLButtonElement, HubButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(hubButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
HubButton.displayName = 'HubButton'

export { HubButton, hubButtonVariants }