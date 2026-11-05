import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { Course } from '../../services/course.api';
import FeaturedCourses, { getFeaturedCoursePage } from './FeaturedCourses';

const course = (id: number): Course => ({
  id,
  title: `Khóa học ${id}`,
  category: 'Lập trình',
  shortDesc: '',
  target: '',
  imageUrl: '',
  format: 'online',
  price: 0,
  status: 'published',
});

describe('FeaturedCourses', () => {
  it('returns a bounded final page without placeholder courses', () => {
    expect(getFeaturedCoursePage([1, 2, 3, 4], 2, 3)).toEqual({ page: 2, totalPages: 2, items: [4] });
    expect(getFeaturedCoursePage([1, 2, 3, 4], 99, 3)).toEqual({ page: 2, totalPages: 2, items: [4] });
  });

  it('shows published courses in pages and exposes accessible next and previous controls', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><FeaturedCourses loadCourses={async () => [1, 2, 3, 4].map(course)} /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Khóa học 1' })).toBeInTheDocument();
    expect(screen.getByText('Trang 1 / 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Khóa học trước' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Khóa học tiếp theo' }));

    expect(screen.getByText('Trang 2 / 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Khóa học 4' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Khóa học 1' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Khóa học tiếp theo' })).toBeDisabled();
  });

  it('uses the heading band without the removed comparison subtitle', async () => {
    render(<MemoryRouter><FeaturedCourses loadCourses={async () => [course(1)]} /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Khóa học nổi bật' })).toBeInTheDocument();
    expect(screen.queryByText(/So sánh thông tin thực có sẵn/i)).not.toBeInTheDocument();
  });
});
