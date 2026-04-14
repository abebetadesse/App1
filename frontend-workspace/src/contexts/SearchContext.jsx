import React, { createContext, useContext } from 'react';
const Ctx = createContext({});
export const Provider = ({ children }) => <Ctx.Provider value={{}}>{children}</Ctx.Provider>;
export default Ctx;
