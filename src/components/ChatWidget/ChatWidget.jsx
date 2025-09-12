import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  X,
  Minimize2,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { useChat } from "../../hooks/useChat";
import "./ChatWidget.css";

const ChatWidget = ({ config = {}, onOpen, onClose, onMessage }) => {
  // Use external config if provided
  const widgetConfig = {
    apiUrl: config.apiUrl || process.env.REACT_APP_API_URL,
    demo: config.demo !== false,
    theme: config.theme || {},
    branding: config.branding || {},
    ...config,
  };

  // End external config setup
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, isTyping, sendMessage, sessionId } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for external events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleSend = (e) => {
      setInputMessage(e.detail.message);
      setTimeout(() => handleSendMessage(), 100);
    };

    window.addEventListener("landmark-chat-open", handleOpen);
    window.addEventListener("landmark-chat-close", handleClose);
    window.addEventListener("landmark-chat-send", handleSend);

    return () => {
      window.removeEventListener("landmark-chat-open", handleOpen);
      window.removeEventListener("landmark-chat-close", handleClose);
      window.removeEventListener("landmark-chat-send", handleSend);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleToggleChat = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const message = inputMessage.trim();
    setInputMessage("");

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    await sendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Widget Container */}
      <div className="chat-widget">
        {/* Floating Chat Button */}
        {!isOpen && !isMinimized && (
          <div className="chat-button-container">
            <button
              onClick={handleToggleChat}
              className="chat-button"
              aria-label="Open chat"
            >
              <MessageCircle size={28} />

              {/* Unread notification */}
              {hasUnread && <div className="unread-indicator"></div>}
            </button>

            {/* Tooltip */}
            <div className="chat-tooltip">Chat with us! (Demo Mode)</div>
          </div>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <button
            onClick={handleOpen}
            className="chat-button"
            aria-label="Open chat"
          >
            <MessageCircle size={28} />
          </button>
        )}

        {/* Expanded Chat Interface */}
        {isOpen && (
          <div className={`chat-container ${isOpen ? "open" : ""}`}>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-avatar">
                  <Bot size={20} />
                </div>
                <div className="chat-info">
                  <h3 className="chat-title">Landmark Africa</h3>
                  <div className="chat-subtitle-container">
                    <p className="chat-subtitle">AI Assistant</p>
                    <span className="demo-badge">Demo</span>
                  </div>
                </div>
              </div>

              <div className="chat-controls">
                <button
                  onClick={handleMinimize}
                  className="chat-control"
                  aria-label="Minimize chat"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={handleClose}
                  className="chat-control"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">
                    {/* Avatar */}
                    <div className={`message-avatar ${message.type}`}>
                      {message.type === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="message-wrapper">
                      <div
                        className={`message-bubble ${message.type} ${
                          message.error ? "error" : ""
                        }`}
                      >
                        <p className="message-text">{message.content}</p>
                        <div className="message-time">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      {message.buttons && (
                        <div className="message-suggestions">
                          {message.buttons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(button)}
                              className="suggestion-btn"
                            >
                              {button}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* AI Suggestions */}
                      {message.suggestions && (
                        <div className="message-suggestions">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="suggestion-btn ai-suggestion"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="message bot">
                  <div className="message-content">
                    <div className="message-avatar bot">
                      <Bot size={16} />
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <span className="typing-text">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input">
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    autoResizeTextarea(e);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="input-field"
                  rows="1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="send-button"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Session Info */}
              {sessionId && (
                <div className="session-info">
                  Session: {sessionId.substring(0, 8)}...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Backdrop */}
      {isOpen && <div className="mobile-backdrop" onClick={handleClose}></div>}
    </>
  );
};

export default ChatWidget;
