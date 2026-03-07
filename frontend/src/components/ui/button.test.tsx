import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { Button } from './button';

// ---------------------------------------------------------------------------
// Render helper
// ---------------------------------------------------------------------------
function renderButton(props = {}) {
  return render(<Button {...props}>Salvar</Button>);
}

// ---------------------------------------------------------------------------
// Default render
// ---------------------------------------------------------------------------
describe('Button — default', () => {
  it('renders children', () => {
    renderButton();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    renderButton();
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-indigo-600/);
    expect(btn.className).toMatch(/text-white/);
  });

  it('renders as <button> element by default', () => {
    renderButton();
    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });
});

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------
describe('Button — variants', () => {
  it('secondary applies border + gray classes', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/border-gray-200/);
    expect(btn.className).toMatch(/text-gray-700/);
  });

  it('danger applies red classes', () => {
    render(<Button variant="danger">Excluir</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-red-600/);
  });

  it('export applies emerald classes', () => {
    render(<Button variant="export">Exportar</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-emerald-700/); // a11y fix: 600=3.77:1 ❌ → 700=5.47:1 ✅
  });

  it('ghost applies transparent bg + hover', () => {
    render(<Button variant="ghost">Fechar</Button>);
    expect(screen.getByRole('button').className).toMatch(/hover:bg-gray-100/);
  });

  it('icon-view applies indigo hover classes', () => {
    render(<Button variant="icon-view" aria-label="Ver">👁</Button>);
    expect(screen.getByRole('button').className).toMatch(/hover:text-indigo-600/);
  });

  it('icon-edit applies amber hover classes', () => {
    render(<Button variant="icon-edit" aria-label="Editar">✏️</Button>);
    expect(screen.getByRole('button').className).toMatch(/hover:text-amber-600/);
  });

  it('icon-delete applies red hover classes', () => {
    render(<Button variant="icon-delete" aria-label="Excluir">🗑</Button>);
    expect(screen.getByRole('button').className).toMatch(/hover:text-red-600/);
  });
});

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------
describe('Button — sizes', () => {
  it('sm applies small padding', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toMatch(/px-3/);
  });

  it('lg applies large padding', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toMatch(/px-5/);
  });

  it('icon applies p-2', () => {
    render(<Button size="icon" aria-label="Ícone">X</Button>);
    expect(screen.getByRole('button').className).toMatch(/p-2/);
  });
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
describe('Button — loading', () => {
  it('disables button when isLoading', () => {
    render(<Button isLoading>Salvando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when loading', () => {
    render(<Button isLoading>Salvando</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows sr-only loading label', () => {
    render(<Button isLoading loadingLabel="Aguarde">Salvar</Button>);
    expect(screen.getByText('Aguarde')).toBeInTheDocument();
  });

  it('renders spinner svg when loading', () => {
    const { container } = render(<Button isLoading>Salvar</Button>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------
describe('Button — disabled', () => {
  it('is disabled via prop', () => {
    render(<Button disabled>Salvar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Salvar</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------
describe('Button — interactions', () => {
  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('accepts custom className', () => {
    render(<Button className="w-full">Salvar</Button>);
    expect(screen.getByRole('button').className).toMatch(/w-full/);
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ---------------------------------------------------------------------------
// Composition (asChild)
// ---------------------------------------------------------------------------
describe('Button — asChild', () => {
  it('renders as anchor when asChild + <a>', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });
});
