import { createContext, useContext, useState, useEffect } from "react";

const ConversationContext = createContext();

export function ConversationProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    const cache = localStorage.getItem("conversations");

    return cache ? JSON.parse(cache) : [];
  });
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  return useContext(ConversationContext);
}
