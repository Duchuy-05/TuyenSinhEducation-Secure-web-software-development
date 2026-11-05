import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ScrollReveal from './ScrollReveal';

describe('ScrollReveal', () => {
  it('keeps content visible before enhancement runs', () => {
    render(<ScrollReveal><p>Nội dung luôn hiển thị</p></ScrollReveal>);
    expect(screen.getByText('Nội dung luôn hiển thị').parentElement).not.toHaveClass('scroll-reveal--hidden');
  });
});
