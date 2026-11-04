import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from './LandingPage';

vi.mock('../services/course.api', () => ({
  courseApi: { getAllCourses: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../services/teacher.api', () => ({
  teacherApi: { getAllTeachers: vi.fn().mockResolvedValue([]) },
}));

const renderPage = () => render(
  <MemoryRouter>
    <LandingPage />
  </MemoryRouter>,
);

describe('LandingPage shell', () => {
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
    expect(document.querySelector('#faq')).toBeInTheDocument();
  });
});
