import { createContext, useContext, useState, useEffect } from 'react';
import { AnonymousUserEventManager } from '@iterable/web-sdk';

const AnonContext = createContext<any>(null);

export function AnonProvider({ children }: any) {
  const [anonymousUserManager, setAnonymousUserManager] =
    useState<AnonymousUserEventManager | null>(null);

  useEffect(() => {
    if (!anonymousUserManager) {
      setAnonymousUserManager(new AnonymousUserEventManager());
    }
  }, []);

  return (
    <AnonContext.Provider
      value={{ anonymousUserManager, setAnonymousUserManager }}
    >
      {children}
    </AnonContext.Provider>
  );
}

export function useAnonContext() {
  return useContext(AnonContext);
}
