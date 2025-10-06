import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LeadModalContext = createContext({ open: () => {}, close: () => {} });

export const useLeadModal = () => useContext(LeadModalContext);

export const LeadModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
    </LeadModalContext.Provider>
  );
};


