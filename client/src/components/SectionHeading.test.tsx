import React from 'react';
import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders title correctly', () => {
    render(<SectionHeading title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const { container } = render(<SectionHeading title="Test Title" />);
    const div = container.firstChild;
    expect(div).toHaveClass('mb-16');
    expect(div).toHaveClass('text-center');
  });
});