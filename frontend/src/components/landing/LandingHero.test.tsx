import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LandingHero from './LandingHero';

describe('LandingHero', () => {
  it('names the technology course offer and provides conversion routes', () => {
    render(<MemoryRouter><LandingHero /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Khóa học về công nghệ' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Khám phá khóa học/i })).toHaveAttribute('href', '/danh-muc-khoa-hoc');
    expect(screen.getByRole('link', { name: /Nhận tư vấn/i })).toHaveAttribute('href', '/lien-he');
  });
});
