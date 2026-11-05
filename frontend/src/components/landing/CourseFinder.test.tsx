import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CourseFinder from './CourseFinder';

describe('CourseFinder', () => {
  it('changes the explicit catalog destination without navigating on selection', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CourseFinder /></MemoryRouter>);
    await user.click(screen.getByRole('radio', { name: /Frontend/i }));
    expect(screen.getByRole('link', { name: /Xem khóa phù hợp/i })).toHaveAttribute('href', '/danh-muc-khoa-hoc?goal=frontend');
  });
});
