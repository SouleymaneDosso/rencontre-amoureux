import { createContext, useContext, useState } from "react";

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [callTarget, setCallTargetState] = useState(null);
  const [callRequestId, setCallRequestId] = useState(0);

  const setCallTarget = (target) => {
    setCallTargetState(target);
    setCallRequestId((prev) => prev + 1);
  };

  return (
    <CallContext.Provider
      value={{
        callTarget,
        setCallTarget,
        callRequestId,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCallContext() {
  return useContext(CallContext);
}