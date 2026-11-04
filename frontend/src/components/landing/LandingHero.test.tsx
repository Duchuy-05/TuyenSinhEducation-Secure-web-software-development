import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LandingHero from './LandingHero';

describe('LandingHero', () => {
  it('states the course offer and provides real conversion routes', () => {
    render(<MemoryRouter><LandingHero /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Khóa học công nghệ thực hành' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá khóa học' })).toHaveAttribute('href', '/danh-muc-khoa-hoc');
    expect(screen.getByRole('link', { name: 'Nhận tư vấn' })).toHaveAttribute('href', '/lien-he');
    expect(screen.getByRole('img', { name: /khóa học công nghệ/i })).toBeInTheDocument();
  });

  it('does not expose carousel controls', () => {
    render(<MemoryRouter><LandingHero /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: /trước|tiếp/i })).not.toBeInTheDocument();
  });
});
