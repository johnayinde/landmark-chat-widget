// src/widget-entry.js - Entry point for standalone widget
import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget from "./components/ChatWidget/ChatWidget";

class LandmarkChatWidget {
  constructor(config = {}) {
    this.config = {
      containerId: "landmark-chat-widget",
      apiUrl: config.apiUrl || "https://your-api.com/api",
      apiKey: config.apiKey || "",
      demo: config.demo !== false, // Default to demo mode
      theme: {
        primaryColor: "#6366f1",
        secondaryColor: "#8b5cf6",
        ...config.theme,
      },
      branding: {
        title: "Landmark Africa",
        subtitle: "AI Assistant",
        ...config.branding,
      },
      position: config.position || "bottom-right",
      autoOpen: config.autoOpen || false,
      ...config,
    };

    this.container = null;
    this.root = null;
    this.isInitialized = false;
  }

  // Initialize the widget
  init() {
    if (this.isInitialized) {
      console.warn("Landmark Chat Widget already initialized");
      return;
    }

    this.createContainer();
    this.renderWidget();
    this.isInitialized = true;

    // Auto-open if configured
    if (this.config.autoOpen) {
      setTimeout(() => this.open(), 1000);
    }
  }

  // Create container element
  createContainer() {
    // Remove existing container
    const existing = document.getElementById(this.config.containerId);
    if (existing) {
      existing.remove();
    }

    // Create new container
    this.container = document.createElement("div");
    this.container.id = this.config.containerId;
    this.container.style.cssText = `
      position: fixed;
      ${
        this.config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"
      }
      ${this.config.position.includes("right") ? "right: 20px;" : "left: 20px;"}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(this.container);
  }

  // Render React widget
  renderWidget() {
    this.root = ReactDOM.createRoot(this.container);
    this.root.render(
      React.createElement(ChatWidget, {
        config: this.config,
        onOpen: this.config.onOpen,
        onClose: this.config.onClose,
        onMessage: this.config.onMessage,
      })
    );
  }

  // Public API methods
  open() {
    window.dispatchEvent(new CustomEvent("landmark-chat-open"));
  }

  close() {
    window.dispatchEvent(new CustomEvent("landmark-chat-close"));
  }

  sendMessage(message) {
    window.dispatchEvent(
      new CustomEvent("landmark-chat-send", {
        detail: { message },
      })
    );
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (this.isInitialized) {
      this.renderWidget(); // Re-render with new config
    }
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
    }
    if (this.container) {
      this.container.remove();
    }
    this.isInitialized = false;
  }
}

// Global API
window.LandmarkChatWidget = LandmarkChatWidget;

// Auto-initialize if config provided via data attributes
function autoInit() {
  const script = document.querySelector('script[src*="landmark-chat-widget"]');
  if (script) {
    const config = {};

    // Read data attributes
    Object.keys(script.dataset).forEach((key) => {
      const value = script.dataset[key];
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );

      // Parse boolean and number values
      if (value === "true") config[camelKey] = true;
      else if (value === "false") config[camelKey] = false;
      else if (!isNaN(value) && value !== "") config[camelKey] = Number(value);
      else config[camelKey] = value;
    });

    // Auto-initialize
    const widget = new LandmarkChatWidget(config);
    widget.init();

    // Store instance globally for access
    window.landmarkChatWidgetInstance = widget;
  }
}

// Initialize when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoInit);
} else {
  autoInit();
}

export default LandmarkChatWidget;
