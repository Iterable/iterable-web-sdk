import { createContext, useContext, useState } from 'react';
import { AnonymousUserEventManager } from '@iterable/web-sdk';

const AnonContext = createContext<any>(null);

export function AnonProvider({ children }: any) {
  const [anonymousUserEventManager, setAnonymousUserEventManager] =
    useState<AnonymousUserEventManager | null>(null);

  return (
    <AnonContext.Provider
      value={{ anonymousUserEventManager, setAnonymousUserEventManager }}
    >
      {children}
    </AnonContext.Provider>
  );
}

export function useAnonContext() {
  return useContext(AnonContext);
}
