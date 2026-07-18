import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useZenny } from './store';

beforeEach(() => {
  useZenny.setState({ subscriptions: [], settings: { currency: 'USD' } });
});

async function addSubscription(name: string, price: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /add subscription/i }));
  const dialog = screen.getByRole('dialog', { name: /new subscription/i });
  await user.type(within(dialog).getByLabelText(/^name$/i), name);
  await user.type(within(dialog).getByLabelText(/price/i), price);
  await user.click(within(dialog).getByRole('button', { name: /save/i }));
}

describe('App — core loop', () => {
  it('shows the empty state and a level-1 egg initially', () => {
    render(<App />);
    expect(screen.getByText(/nothing tracked yet/i)).toBeInTheDocument();
    expect(screen.getByText(/zenny the egg/i)).toBeInTheDocument();
    expect(screen.getByText(/lv\. 1/i)).toBeInTheDocument();
  });

  it('adds a subscription and updates the burn totals', async () => {
    render(<App />);
    await addSubscription('Netflix', '15.49');
    expect(within(screen.getByLabelText(/tracked subscriptions/i)).getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly burn/i).textContent ?? '').toContain('$15.49');
    expect(screen.getByLabelText(/yearly burn/i).textContent ?? '').toContain('$185.88');
  });

  it('validates bad price input', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /add subscription/i }));
    const dialog = screen.getByRole('dialog', { name: /new subscription/i });
    await user.type(within(dialog).getByLabelText(/^name$/i), 'X');
    await user.type(within(dialog).getByLabelText(/price/i), 'abc');
    await user.click(within(dialog).getByRole('button', { name: /save/i }));
    expect(within(dialog).getByRole('alert')).toHaveTextContent(/valid price/i);
  });

  it('slays a subscription: trophy shelf, rescued ledger and pet level up', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addSubscription('Adobe CC', '59.99'); // $719.88/yr → dragon (level 5)
    await user.click(screen.getByRole('button', { name: /slay adobe cc/i }));

    expect(screen.getByLabelText(/trophy shelf/i)).toHaveTextContent('Adobe CC');
    expect(screen.getByText(/rescued/i, { selector: '.rescued' })).toHaveTextContent('$719.88/yr');
    expect(screen.getByText(/zenny the dragon/i)).toBeInTheDocument();
    expect(screen.getByText(/lv\. 5/i)).toBeInTheDocument();
    // burn is back to zero
    expect(screen.getByLabelText(/monthly burn/i).textContent ?? '').toContain('$0.00');
    // share becomes available
    expect(screen.getByRole('button', { name: /share victory/i })).toBeInTheDocument();
  });

  it('restores a slain subscription', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addSubscription('Hulu', '9.99');
    await user.click(screen.getByRole('button', { name: /slay hulu/i }));
    await user.click(screen.getByRole('button', { name: /restore hulu/i }));
    expect(screen.queryByLabelText(/trophy shelf/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/monthly burn/i).textContent ?? '').toContain('$9.99');
  });

  it('runs the weekly check-in flow and flags zombies', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addSubscription('Gym', '40.00');
    const checkin = screen.getByLabelText(/weekly check-in/i);
    expect(checkin).toHaveTextContent(/did you actually use/i);
    await user.click(within(checkin).getByRole('button', { name: /^no$/i }));
    // one unused check within the window → zombie badge + prompt gone
    expect(screen.queryByLabelText(/weekly check-in/i)).not.toBeInTheDocument();
    expect(screen.getByText(/🧟 zombie/i)).toBeInTheDocument();
  });

  it('opens the share card dialog after a slay', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addSubscription('Hulu', '9.99');
    await user.click(screen.getByRole('button', { name: /slay hulu/i }));
    await user.click(screen.getByRole('button', { name: /share victory/i }));
    expect(screen.getByRole('dialog', { name: /share your victory/i })).toBeInTheDocument();
  });

  it('persists subscriptions across remounts', async () => {
    const { unmount } = render(<App />);
    await addSubscription('Spotify', '11.99');
    unmount();
    render(<App />);
    expect(within(screen.getByLabelText(/tracked subscriptions/i)).getByText('Spotify')).toBeInTheDocument();
  });
});
