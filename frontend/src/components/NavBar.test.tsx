import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Navbar from './NavBar';

vi.mock('../services/api', () => ({
  authApi: { logout: vi.fn().mockResolvedValue(undefined) },
}));

const renderNav = () => render(<MemoryRouter><Navbar /></MemoryRouter>);

describe('Navbar', () => {
  it('opens and dismisses the mobile navigation with focus restoration', async () => {
    const user = userEvent.setup();
    renderNav();
    const trigger = screen.getByRole('button', { name: /mở menu/i });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: /menu chính/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'Khóa học' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /menu chính/i })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('does not crash when stored user data is corrupt', () => {
    localStorage.setItem('user', '{not-json');
    expect(renderNav).not.toThrow();
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toBeInTheDocument();
  });

  it('opens the account menu using a button', async () => {
    localStorage.setItem('user', JSON.stringify({ fullName: 'Nguyễn An', email: 'an@example.com' }));
    const user = userEvent.setup();
    renderNav();

    const account = screen.getByRole('button', { name: /tài khoản của nguyễn an/i });
    await user.click(account);
    expect(account).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
