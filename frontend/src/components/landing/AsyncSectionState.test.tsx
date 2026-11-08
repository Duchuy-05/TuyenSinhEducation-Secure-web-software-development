import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AsyncSectionState from './AsyncSectionState';

describe('AsyncSectionState', () => {
  it('offers an accessible retry for errors and an aria-busy loading state', () => {
    const retry = vi.fn();
    const { rerender } = render(<AsyncSectionState status="loading" title="Khóa học" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    rerender(<AsyncSectionState status="error" title="Khóa học" onRetry={retry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    screen.getByRole('button', { name: /thử lại/i }).click();
    expect(retry).toHaveBeenCalledOnce();
  });
});
