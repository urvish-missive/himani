import { createContext, useContext, useState, type ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  isHireBarVisible: boolean;
  setIsHireBarVisible: (visible: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHireBarVisible, setIsHireBarVisible] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleChat,
        openChat,
        closeChat,
        isHireBarVisible,
        setIsHireBarVisible,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
