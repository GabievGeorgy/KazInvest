import { ReactNode, useEffect, useSyncExternalStore } from 'react';
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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    function updateViewportVariables() {
      const visualViewport = window.visualViewport;
      const viewportHeight = visualViewport?.height ?? window.innerHeight;

      root.style.setProperty('--app-height', `${viewportHeight}px`);
    }

    updateViewportVariables();

    window.addEventListener('resize', updateViewportVariables);
    window.visualViewport?.addEventListener('resize', updateViewportVariables);
    window.visualViewport?.addEventListener('scroll', updateViewportVariables);

    return () => {
      window.removeEventListener('resize', updateViewportVariables);
      window.visualViewport?.removeEventListener('resize', updateViewportVariables);
      window.visualViewport?.removeEventListener('scroll', updateViewportVariables);
      root.style.removeProperty('--app-height');
    };
  }, []);

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
}
