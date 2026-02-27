import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTION_LOADING_MS, CONFIRM_DIALOG_EXIT_MS, MAX_TODO_LENGTH, STORAGE_KEY } from './constants';
import { App } from './app';

const flushActionDelay = async () => {
  await vi.advanceTimersByTimeAsync(ACTION_LOADING_MS + 1);
};

const flushDialogOpen = async () => {
  await vi.advanceTimersByTimeAsync(1);
  await Promise.resolve();
};

const flushDialogExit = async () => {
  await vi.advanceTimersByTimeAsync(1);
  await Promise.resolve();
  await vi.advanceTimersByTimeAsync(CONFIRM_DIALOG_EXIT_MS + ACTION_LOADING_MS + 10);
  await Promise.resolve();
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
    await flushDialogOpen();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Cancel delete'));
    await flushActionDelay();
    await flushDialogExit();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Delete todo'));
    await flushDialogOpen();
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
    await flushDialogOpen();

    const keepButton = screen.getByLabelText('Cancel delete');
    const confirmButton = screen.getByLabelText('Confirm delete');
    await Promise.resolve();
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

  it('updates character counter warning and danger states', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const input = screen.getByLabelText('What needs doing?');

    await user.type(input, 'x'.repeat(MAX_TODO_LENGTH - 19));
    const warningCounter = screen.getByText('19 left');
    expect(warningCounter).toHaveClass('char-count warning');

    await user.type(input, 'y'.repeat(19));
    const dangerCounter = screen.getByText('0 left');
    expect(dangerCounter).toHaveClass('char-count danger');
  });

  it('shows loading state while creating a todo', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByLabelText('What needs doing?'), 'Review release checklist');
    const submitButton = screen.getByLabelText('Add todo');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');

    await flushActionDelay();
    expect(screen.getByText('YOUR FOCUS')).toBeInTheDocument();
  });
});
