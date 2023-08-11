import { createContext, useContext, useState, useEffect } from 'react';
import { AnonymousUserEventManager } from '@iterable/web-sdk';

const AnonContext = createContext<any>(null);

export function AnonProvider({ children }: any) {
  const [anonymousUserEventManager, setAnonymousUserEventManager] =
    useState<AnonymousUserEventManager | null>(null);

  useEffect(() => {
    if (!anonymousUserEventManager) {
      console.log('App started');
      setAnonymousUserEventManager(new AnonymousUserEventManager());
    }
  }, []);

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
