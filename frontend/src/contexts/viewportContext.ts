import { createContext } from 'react';

export type ViewportContextValue = {
  isMobile: boolean;
};

export const ViewportContext = createContext<ViewportContextValue>({
  isMobile: false,
});
