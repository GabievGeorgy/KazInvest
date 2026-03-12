import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the starter headline', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /react frontend and \.net 10 api scaffold/i,
      }),
    ).toBeInTheDocument();
  });
});

