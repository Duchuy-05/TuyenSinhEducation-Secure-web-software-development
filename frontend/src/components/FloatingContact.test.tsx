import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import FloatingContact from './FloatingContact';

describe('FloatingContact', () => {
  it('opens an accessible dialog and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(<FloatingContact />);
    const launcher = screen.getByRole('button', { name: /liên hệ đức Huy Education/i });
    await user.click(launcher);
    const dialog = screen.getByRole('dialog', { name: /liên hệ đức Huy Education/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('link', { name: /gọi 0926008221/i })).toHaveAttribute('href', 'tel:0926008221');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();
  });

  it('renders one persistent launcher instead of separate social buttons', () => {
    render(<FloatingContact />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
