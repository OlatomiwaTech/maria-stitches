import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      primary: 'bg-espresso text-ivory hover:bg-burgundy',
      outline: 'border border-espresso/20 bg-transparent text-espresso hover:border-espresso hover:bg-beige/50',
      ghost: 'text-espresso hover:bg-beige/70',
      whatsapp: 'bg-[#28724b] text-white hover:bg-[#1e5c3b]',
    },
    size: { default: 'min-h-11 px-5 text-sm', sm: 'min-h-9 px-3 text-xs', lg: 'min-h-13 px-7 text-sm' },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
