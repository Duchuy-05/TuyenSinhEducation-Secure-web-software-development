import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CourseProductCard from './CourseProductCard';

const baseCourse = { id: 1, title: 'React cơ bản', description: null, outcome: null, category: 'Lập trình Frontend', duration: null, curriculumCount: 0, teacherName: null, imageUrl: null, priceLabel: 'Miễn phí', originalPriceLabel: null };

describe('CourseProductCard', () => {
  it('places the supplied category before the course title', () => {
    render(<MemoryRouter><CourseProductCard course={baseCourse} /></MemoryRouter>);
    const category = screen.getByText('Lập trình Frontend');
    const title = screen.getByRole('heading', { name: 'React cơ bản' });
    expect(category.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('omits the category label when the course has no category', () => {
    render(<MemoryRouter><CourseProductCard course={{ ...baseCourse, category: null }} /></MemoryRouter>);
    expect(screen.queryByText('Lập trình Frontend')).not.toBeInTheDocument();
  });
});
