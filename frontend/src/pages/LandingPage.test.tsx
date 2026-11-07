import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { courseApi } from '../services/course.api';
import LandingPage from './LandingPage';

vi.mock('../services/course.api', () => ({
  courseApi: { getAllCourses: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../services/teacher.api', () => ({
  teacherApi: { getAllTeachers: vi.fn().mockResolvedValue([]) },
}));

const scrollIntoView = vi.fn();

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
});

const renderPage = (initialEntry = '/') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <LandingPage />
  </MemoryRouter>,
);

describe('LandingPage shell', () => {
  beforeEach(() => {
    scrollIntoView.mockClear();
  });

  it('provides one main landmark and one visible level-one heading', () => {
    renderPage();

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('provides navigation and footer landmarks', () => {
    renderPage();

    expect(screen.getByRole('navigation', { name: /chính/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('provides a skip link and stable section anchors', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /bỏ qua điều hướng/i })).toHaveAttribute('href', '#main-content');
    expect(document.querySelector('#courses')).toBeInTheDocument();
    expect(document.querySelector('#learning-paths')).toBeInTheDocument();
    expect(document.querySelector('#teachers')).toBeInTheDocument();
    expect(document.querySelector('#faq')).not.toBeInTheDocument();
  });

  it.each([
    ['/#learning-paths', 'learning-paths-title'],
    ['/#teachers', 'teachers-title'],
  ])('smoothly scrolls the labelled heading requested by %s below the navbar', async (initialEntry, headingId) => {
    renderPage(initialEntry);

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledOnce());
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById(headingId));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('ignores a URL hash that does not match a landing-page section', () => {
    expect(() => renderPage('/#unknown')).not.toThrow();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('waits for content above the requested heading to settle before scrolling', async () => {
    let resolveCourses!: (courses: []) => void;
    const pendingCourses = new Promise<[]>((resolve) => {
      resolveCourses = resolve;
    });
    vi.mocked(courseApi.getAllCourses).mockReturnValueOnce(pendingCourses);

    renderPage('/#learning-paths');
    expect(scrollIntoView).not.toHaveBeenCalled();

    resolveCourses([]);

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledOnce());
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById('learning-paths-title'));
  });
});
