
import { createContext, useContext, useState } from "react";

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [callTarget, setCallTarget] = useState(null);

  return (
    <CallContext.Provider
      value={{
        callTarget,
        setCallTarget,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCallContext() {
  return useContext(CallContext);
}

