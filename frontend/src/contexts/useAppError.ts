import { useContext } from 'react';
import { AppErrorContext } from './appErrorContext';

export function useAppError() {
  return useContext(AppErrorContext);
}
