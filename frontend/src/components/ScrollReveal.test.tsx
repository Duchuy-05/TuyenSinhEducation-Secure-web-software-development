import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScrollReveal from './ScrollReveal';

describe('ScrollReveal', () => {
  it('keeps content visible before enhancement runs', () => {
    render(<ScrollReveal><p>Nội dung luôn hiển thị</p></ScrollReveal>);
    expect(screen.getByText('Nội dung luôn hiển thị').parentElement).not.toHaveClass('scroll-reveal--hidden');
  });

  it('keeps a hash target visible without observing it', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const IntersectionObserverMock = vi.fn(function (this: { observe: typeof observe; disconnect: typeof disconnect }) {
      this.observe = observe;
      this.disconnect = disconnect;
    });
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

    render(<ScrollReveal forceVisible><p>Đích điều hướng</p></ScrollReveal>);

    expect(screen.getByText('Đích điều hướng').parentElement).toHaveClass('scroll-reveal--visible');
    expect(IntersectionObserverMock).not.toHaveBeenCalled();
  });
});
