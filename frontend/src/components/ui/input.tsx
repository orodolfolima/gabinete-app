// Input, Select, Textarea — SIGGAP Design System | Atomic level: Atom
// Tokens: outputs/design-system/siggap/tokens/tokens.yaml
// Usage: import { Input, Select, Textarea } from '@/components/ui'
import * as React from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Shared base classes (from design tokens)
// token: input.border → gray-200 | input.ring → indigo-500
// ---------------------------------------------------------------------------
const baseInputClasses = [
  'w-full rounded-lg border border-gray-200 bg-white',
  'px-3 py-2 text-sm text-gray-900',
  'placeholder:text-gray-400',
  'transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
  'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
  'aria-invalid:border-red-400 aria-invalid:focus:ring-red-500',
].join(' ')

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Render in error state */
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(baseInputClasses, className)}
      aria-invalid={error || undefined}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        baseInputClasses,
        'appearance-none bg-white cursor-pointer',
        // chevron icon via background-image (no extra dep)
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] pr-8",
        className
      )}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(baseInputClasses, 'resize-none min-h-[80px]', className)}
      aria-invalid={error || undefined}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

// ---------------------------------------------------------------------------
// FormField — label + input + error message composition
// ---------------------------------------------------------------------------
export interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function FormField({ label, htmlFor, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { Input, Select, Textarea, FormField }
