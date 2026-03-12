import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the chat landing headline', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /what would you like to know\?/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/ask whatever you want/i)).toBeInTheDocument();
  });
});
