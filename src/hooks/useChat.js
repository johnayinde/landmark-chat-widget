import { useState, useEffect, useCallback } from "react";
import { chatAPI } from "../services/chatAPI";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const session = await chatAPI.initializeSession();
      setSessionId(session.sessionId);

      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "Welcome to Landmark Africa! I'm your AI assistant ready to help with bookings, information, and support.",
        timestamp: new Date().toISOString(),
        buttons: ["Opening Hours", "Book UDH", "Facilities", "Complaint"],
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Failed to initialize session:", error);
      // Fallback session
      setSessionId(`demo_${Date.now()}`);

      const welcomeMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "Welcome to Landmark Africa! I'm your AI assistant ready to help with bookings, information, and support. (Demo Mode)",
        timestamp: new Date().toISOString(),
        buttons: ["Opening Hours", "Book UDH", "Facilities", "Complaint"],
      };

      setMessages([welcomeMessage]);
    }
  };

  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim()) return;

      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        // Send to API
        const response = await chatAPI.sendMessage({
          sessionId,
          message: messageText,
          history: messages.slice(-10), // Send last 10 messages for context
        });

        // Add bot response
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.message,
          timestamp: new Date().toISOString(),
          suggestions: response.suggestions,
          error: false,
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Failed to send message:", error);

        // Add error message
        const errorMessage = {
          id: Date.now() + 1,
          type: "bot",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
          error: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const getSessionInfo = useCallback(() => {
    return {
      sessionId,
      messageCount: messages.length,
      hasMessages: messages.length > 0,
    };
  }, [sessionId, messages.length]);

  return {
    messages,
    isTyping,
    sessionId,
    sendMessage,
    clearMessages,
    getSessionInfo,
  };
};
