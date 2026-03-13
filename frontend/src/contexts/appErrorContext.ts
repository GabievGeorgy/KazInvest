import { createContext } from 'react';

export type AppErrorContextValue = {
  errorMessage: string | null;
  showError: (message: string) => void;
  clearError: () => void;
};

export const AppErrorContext = createContext<AppErrorContextValue>({
  errorMessage: null,
  showError: () => undefined,
  clearError: () => undefined,
});
