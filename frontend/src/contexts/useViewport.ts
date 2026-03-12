import { useContext } from 'react';
import { ViewportContext } from './viewportContext';

export function useViewport() {
  return useContext(ViewportContext);
}

