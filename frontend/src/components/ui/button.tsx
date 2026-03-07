import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Variant catalogue — derived from SIGGAP design tokens
// Source: outputs/design-system/siggap/tokens/tokens.yaml
// All values reference Tailwind utilities that map to consolidated tokens.
// ---------------------------------------------------------------------------
export const buttonVariants = cva(
  // Base: layout, typography, transition, focus-ring, disabled
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium text-sm',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-60',
    'select-none',
  ],
  {
    variants: {
      variant: {
        // token: color.brand → indigo-600
        primary:
          'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:opacity-100',
        // token: color.secondary → border + gray
        secondary:
          'border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50',
        // token: color.danger → red-600
        danger:
          'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:opacity-100',
        // token: color.export → emerald-700 (a11y: emerald-600=3.77:1 fails AA; emerald-700=5.47:1 ✅)
        export:
          'bg-emerald-700 text-white hover:bg-emerald-800 disabled:bg-gray-400 disabled:opacity-100',
        // token: color.ghost → transparent hover
        ghost:
          'bg-transparent text-gray-600 hover:bg-gray-100',
        // token: color.outline → border + transparent
        outline:
          'border border-gray-200 bg-transparent hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
        // icon-action variants (table row actions)
        'icon-view':
          'p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50',
        'icon-edit':
          'p-0 text-gray-400 hover:text-amber-600 hover:bg-amber-50',
        'icon-delete':
          'p-0 text-gray-400 hover:text-red-600 hover:bg-red-50',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm', // standard (btn-x=16px, btn-y=10px)
        lg: 'px-5 py-3 text-base',
        icon: 'p-2', // ghost/close buttons
      },
    },
    compoundVariants: [
      // icon-action variants ignore size padding — always p-2
      { variant: 'icon-view', size: 'md', className: 'p-2' },
      { variant: 'icon-edit', size: 'md', className: 'p-2' },
      { variant: 'icon-delete', size: 'md', className: 'p-2' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (Radix Slot pattern for composition) */
  asChild?: boolean
  /** Show loading spinner and disable interactions */
  isLoading?: boolean
  /** Custom loading label for screen readers (default: "Carregando…") */
  loadingLabel?: string
}

// ---------------------------------------------------------------------------
// Spinner — inline to keep component self-contained
// ---------------------------------------------------------------------------
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingLabel = 'Carregando…',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || isLoading || undefined}
        {...props}
      >
        {asChild ? children : (
          <>
            {isLoading && (
              <>
                <Spinner className="h-4 w-4" />
                <span className="sr-only">{loadingLabel}</span>
              </>
            )}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button };
