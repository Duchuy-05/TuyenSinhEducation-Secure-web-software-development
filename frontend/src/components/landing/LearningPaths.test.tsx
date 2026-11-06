import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { landingContent } from '../../content/landingContent';
import LearningPaths from './LearningPaths';

describe('LearningPaths', () => {
  it('presents four independent, non-interactive paths for comparison', () => {
    render(<LearningPaths />);

    const section = screen.getByRole('region', { name: 'Chọn lộ trình theo mục tiêu' });
    const list = within(section).getByRole('list');
    expect(list.tagName).toBe('UL');

    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(4);

    landingContent.learningPaths.forEach((path, index) => {
      const item = within(items[index]);
      expect(item.getByRole('heading', { name: path.title })).toBeInTheDocument();
      expect(item.getByText(path.entry)).toBeInTheDocument();
      path.courses.forEach((course) => expect(items[index]).toHaveTextContent(course));
      expect(item.getByText(path.outcome)).toBeInTheDocument();
    });

    expect(within(section).queryByRole('link')).not.toBeInTheDocument();
    expect(within(section).queryByRole('button')).not.toBeInTheDocument();
  });
});
