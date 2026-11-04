import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CTA from './CTA';

describe('CTA', () => {
  it('uses concise copy and real routes', () => {
    render(<MemoryRouter><CTA /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Chọn khóa học phù hợp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Xem khóa học' })).toHaveAttribute('href', '/danh-muc-khoa-hoc');
    expect(screen.getByRole('link', { name: 'Liên hệ tư vấn' })).toHaveAttribute('href', '/lien-he');
  });
});
