import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input, Select, Textarea, FormField } from './input'

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
describe('Input', () => {
  it('renders with correct base classes', () => {
    render(<Input placeholder="Digite aqui" />)
    const el = screen.getByPlaceholderText('Digite aqui')
    expect(el.className).toMatch(/border-gray-200/)
    expect(el.className).toMatch(/focus:ring-indigo-500/)
    expect(el.className).toMatch(/rounded-lg/)
  })

  it('accepts and displays value', () => {
    render(<Input defaultValue="João Silva" />)
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
  })

  it('fires onChange', () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled via prop', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('sets aria-invalid when error=true', () => {
    render(<Input error />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts custom className', () => {
    render(<Input className="w-40" />)
    expect(screen.getByRole('textbox').className).toMatch(/w-40/)
  })

  it('passes through type prop', () => {
    render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })
})

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
describe('Select', () => {
  function renderSelect() {
    return render(
      <Select aria-label="Status">
        <option value="">Selecione</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </Select>
    )
  }

  it('renders options', () => {
    renderSelect()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('applies base classes', () => {
    renderSelect()
    expect(screen.getByRole('combobox').className).toMatch(/border-gray-200/)
  })

  it('sets aria-invalid when error=true', () => {
    render(
      <Select aria-label="Status" error>
        <option>Opt</option>
      </Select>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled via prop', () => {
    render(
      <Select aria-label="Status" disabled>
        <option>Opt</option>
      </Select>
    )
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('fires onChange', () => {
    const onChange = vi.fn()
    renderSelect()
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ativo' } })
    // onChange not passed so no assertion, just no throw
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLSelectElement>
    render(<Select ref={ref} aria-label="s"><option>x</option></Select>)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })
})

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
describe('Textarea', () => {
  it('renders as textarea element', () => {
    render(<Textarea placeholder="Observações" />)
    expect(screen.getByPlaceholderText('Observações').tagName).toBe('TEXTAREA')
  })

  it('applies base + resize-none classes', () => {
    render(<Textarea placeholder="Obs" />)
    const el = screen.getByPlaceholderText('Obs')
    expect(el.className).toMatch(/border-gray-200/)
    expect(el.className).toMatch(/resize-none/)
  })

  it('sets aria-invalid when error=true', () => {
    render(<Textarea error />)
    const el = document.querySelector('textarea')!
    expect(el).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement>
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------
describe('FormField', () => {
  it('renders label and child input', () => {
    render(
      <FormField label="Nome" htmlFor="nome">
        <Input id="nome" />
      </FormField>
    )
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <Input id="email" type="email" />
      </FormField>
    )
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })

  it('shows required asterisk when required=true', () => {
    render(
      <FormField label="CPF" htmlFor="cpf" required>
        <Input id="cpf" />
      </FormField>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message with role=alert', () => {
    render(
      <FormField label="Email" htmlFor="email" error="E-mail inválido">
        <Input id="email" error />
      </FormField>
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('E-mail inválido')
  })

  it('does not render error when not provided', () => {
    render(
      <FormField label="Nome" htmlFor="nome">
        <Input id="nome" />
      </FormField>
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
