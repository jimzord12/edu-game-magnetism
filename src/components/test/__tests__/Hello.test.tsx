import { render, screen } from '@testing-library/react';
import { Hello } from '../Hello';

test('renders the correct name', () => {
  render(<Hello name="Jim" />);
  expect(screen.getByText('Hello, Jim!')).toBeInTheDocument();
});
