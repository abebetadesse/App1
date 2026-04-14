import React, { createContext, useContext } from 'react';
const Context = createContext({});
export const MoodleSyncProvider = ({ children }) => <Context.Provider value={{}}>{children}</Context.Provider>;
export const useMoodleSync = () => useContext(Context);
