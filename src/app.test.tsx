import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTION_LOADING_MS, CONFIRM_DIALOG_EXIT_MS, STORAGE_KEY } from './constants';
import { App } from './app';

const flushActionDelay = async () => {
  await vi.advanceTimersByTimeAsync(ACTION_LOADING_MS + 1);
};

const flushDialogExit = async () => {
  await vi.advanceTimersByTimeAsync(CONFIRM_DIALOG_EXIT_MS + 1);
};

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

  it('renders a single main landmark', () => {
    render(<App />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('creates and completes a todo', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Send proposal');
    await user.click(screen.getByLabelText('Add todo'));
    await flushActionDelay();

    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();
    expect(screen.getByText('Send proposal')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Send proposal');

    await user.click(screen.getByLabelText('Mark todo as done'));
    await flushActionDelay();

    expect(screen.getByText('What needs doing?')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('runs cancel and confirm paths for delete dialog', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Write quarterly update');
    await user.click(screen.getByLabelText('Add todo'));
    await flushActionDelay();

    await user.click(screen.getByLabelText('Delete todo'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Cancel delete'));
    await flushActionDelay();
    await flushDialogExit();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Delete todo'));
    await user.click(screen.getByLabelText('Confirm delete'));
    await flushActionDelay();
    await flushDialogExit();

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('What needs doing?')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('traps focus in confirm dialog and supports Escape to cancel', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Prepare release notes');
    await user.click(screen.getByLabelText('Add todo'));
    await flushActionDelay();

    await user.click(screen.getByLabelText('Delete todo'));

    const keepButton = screen.getByLabelText('Cancel delete');
    const confirmButton = screen.getByLabelText('Confirm delete');
    expect(keepButton).toHaveFocus();

    await user.tab();
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(keepButton).toHaveFocus();

    await user.keyboard('{Escape}');
    await flushActionDelay();
    await flushDialogExit();

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();
  });

  it('shows validation error for empty submission', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByLabelText('Add todo'));
    await flushActionDelay();

    expect(screen.getAllByText('Your todo needs some words. Type something.').length).toBeGreaterThan(0);
    expect(screen.queryByText('YOUR FOCUS')).not.toBeInTheDocument();
  });
});
