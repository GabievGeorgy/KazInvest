import { type ReactNode, useState } from 'react';
import { AppErrorContext } from './appErrorContext';

export function AppErrorProvider({ children }: { children: ReactNode }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function showError(message: string) {
    setErrorMessage(message);
  }

  function clearError() {
    setErrorMessage(null);
  }

  return (
    <AppErrorContext.Provider value={{ errorMessage, showError, clearError }}>
      {children}
    </AppErrorContext.Provider>
  );
}
