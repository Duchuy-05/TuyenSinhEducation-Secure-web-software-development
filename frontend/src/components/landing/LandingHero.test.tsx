import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LandingHero from './LandingHero';

describe('LandingHero', () => {
  it('names the technology course offer and provides conversion routes', () => {
    render(<MemoryRouter><LandingHero /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Khóa học về công nghệ' })).toBeInTheDocument();
    expect(screen.getByTestId('landing-title-line-1')).toHaveTextContent('Khóa học về');
    expect(screen.getByTestId('landing-title-line-2')).toHaveTextContent('công nghệ');
    expect(screen.getByRole('link', { name: /Khám phá khóa học/i })).toHaveAttribute('href', '/danh-muc-khoa-hoc');
    expect(screen.getByRole('link', { name: /Nhận tư vấn/i })).toHaveAttribute('href', '/lien-he');
  });

  it('keeps both title lines in one selectable inline flow', () => {
    const landingStyles = readFileSync(resolve('src/styles/LandingPage.css'), 'utf8');
    const titleStyles = landingStyles.match(/\.landing-hero h1 span\s*\{([^}]+)\}/)?.[1] ?? '';
    const styleProbe = document.createElement('div');
    styleProbe.style.cssText = titleStyles;
    render(<MemoryRouter><LandingHero /></MemoryRouter>);

    expect(styleProbe.style.display).toBe('inline');
    expect(screen.getByRole('heading', { level: 1 }).querySelector('br')).toHaveClass('landing-title-break');
  });

  it('does not render selectable whitespace between the title lines', () => {
    render(<MemoryRouter><LandingHero /></MemoryRouter>);

    const heading = screen.getByRole('heading', { level: 1 });
    const blankTextNodes = Array.from(heading.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === '',
    );

    expect(blankTextNodes).toHaveLength(0);
  });
});
