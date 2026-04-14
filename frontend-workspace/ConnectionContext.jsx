import React, { createContext, useContext } from 'react';
const Context = createContext({});
export const ConnectionProvider = ({ children }) => <Context.Provider value={{}}>{children}</Context.Provider>;
export const useConnectionManager = () => useContext(Context);
