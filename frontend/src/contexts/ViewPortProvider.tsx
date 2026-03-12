import { ReactNode, useSyncExternalStore } from 'react';
import { ViewportContext } from './viewportContext';

const mobileQuery = '(max-width: 640px)';

function getMediaQueryList() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  return window.matchMedia(mobileQuery);
}

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = getMediaQueryList();

  if (!mediaQueryList) {
    return () => undefined;
  }

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange);
  };
}

function getSnapshot() {
  return getMediaQueryList()?.matches ?? false;
}

export function ViewportProvider({ children }: { children: ReactNode }) {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
}
