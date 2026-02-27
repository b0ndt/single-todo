import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTION_LOADING_MS, STORAGE_KEY } from './constants';
import { App } from './app';

describe('App critical paths', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders empty state on first load', () => {
    render(<App />);

    expect(screen.getByText('What needs doing?')).toBeInTheDocument();
    expect(screen.getByLabelText('What needs doing?')).toBeInTheDocument();
    expect(screen.queryByText('YOUR FOCUS')).not.toBeInTheDocument();
  });

  it('creates and completes a todo', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Send proposal');
    await user.click(screen.getByLabelText('Add todo'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);

    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();
    expect(screen.getByText('Send proposal')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Send proposal');

    await user.click(screen.getByLabelText('Mark todo as done'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);

    expect(screen.getByText('What needs doing?')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('runs cancel and confirm paths for delete dialog', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Write quarterly update');
    await user.click(screen.getByLabelText('Add todo'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);

    await user.click(screen.getByLabelText('Delete todo'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Cancel delete'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Delete todo'));
    await user.click(screen.getByLabelText('Confirm delete'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('What needs doing?')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('shows validation error for empty submission', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByLabelText('Add todo'));
    vi.advanceTimersByTime(ACTION_LOADING_MS + 1);

    expect(screen.getByText('Your todo needs some words. Type something.')).toBeInTheDocument();
    expect(screen.queryByText('YOUR FOCUS')).not.toBeInTheDocument();
  });
});
