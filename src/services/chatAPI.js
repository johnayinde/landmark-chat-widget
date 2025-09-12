// Chat API Service
const API_CONFIG = {
  baseUrl: "https://your-api-endpoint.com/api",
  apiKey: "",
  demo: true,
};

class ChatAPI {
  constructor(config = API_CONFIG) {
    this.config = {
      baseUrl:
        config.baseUrl || config.apiUrl || "https://your-api-endpoint.com/api",
      apiKey: config.apiKey || "",
      demo: config.demo !== false,
    };
  }

  async initializeSession() {
    if (this.config.demo) {
      // Demo mode - generate random session ID
      return {
        sessionId: `demo_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        message: "Demo session initialized",
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          metadata: {
            page: window.location.href,
            referrer: document.referrer,
            platform: "react-web",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Session initialization failed:", error);
      // Fallback to demo mode
      return {
        sessionId: `fallback_${Date.now()}`,
        message: "Fallback session initialized",
      };
    }
  }

  async sendMessage({ sessionId, message, history = [] }) {
    if (this.config.demo) {
      // Demo mode - simulate API delay and responses
      await this.simulateDelay(800, 2000);
      return this.getDemoResponse(message);
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          sessionId,
          message,
          history,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            page: window.location.href,
            platform: "react-web",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        message: data.response || data.message,
        suggestions: data.suggestions,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error("Message send failed:", error);
      throw new Error("Failed to send message to API");
    }
  }

  async getSessionHistory(sessionId) {
    if (this.config.demo) {
      return { messages: [], sessionId };
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/chat/session/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get session history:", error);
      throw new Error("Failed to retrieve session history");
    }
  }

  // Demo response generator
  getDemoResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Context-aware responses
    if (
      lowerMessage.includes("opening hours") ||
      lowerMessage.includes("hours")
    ) {
      return {
        message:
          "Our facilities are open 24/7! The main reception is always available, while specific amenities have the following hours:\n\n🏊 Pool & Spa: 6:00 AM - 10:00 PM\n🍽️ Restaurant: 7:00 AM - 11:00 PM\n🏋️ Fitness Center: 5:00 AM - 11:00 PM\n\nIs there a specific facility you'd like to know about?",
        suggestions: ["Pool Hours", "Restaurant Menu", "Gym Access"],
      };
    }

    if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("booking") ||
      lowerMessage.includes("reservation")
    ) {
      return {
        message:
          "I'd be happy to help you with your booking! We offer several accommodation options:\n\n🏨 Executive Suites - From ₦45,000/night\n🏖️ Ocean View Rooms - From ₦35,000/night\n🌟 Standard Rooms - From ₦25,000/night\n\nAll rooms include complimentary breakfast and WiFi. What dates are you looking at?",
        suggestions: ["Check Availability", "View Packages", "Contact Sales"],
      };
    }

    if (
      lowerMessage.includes("facilities") ||
      lowerMessage.includes("amenities")
    ) {
      return {
        message:
          "We offer world-class facilities for your comfort:\n\n🏊 Olympic-size swimming pool\n💆 Full-service spa & wellness center\n🍽️ 3 restaurants & 2 bars\n🏋️ State-of-the-art fitness center\n🎾 Tennis court\n🚗 Complimentary valet parking\n🏛️ Conference rooms & business center\n\nWhich facility interests you most?",
        suggestions: ["Pool & Spa", "Dining Options", "Business Center"],
      };
    }

    if (
      lowerMessage.includes("complaint") ||
      lowerMessage.includes("problem") ||
      lowerMessage.includes("issue")
    ) {
      return {
        message:
          "I'm sorry to hear you're experiencing an issue. Your feedback is very important to us. I can help you:\n\n📝 File a formal complaint\n📞 Connect you with our manager\n💬 Resolve the issue right now\n\nPlease let me know what happened, and I'll make sure it's addressed promptly.",
        suggestions: ["Speak to Manager", "File Complaint", "Describe Issue"],
      };
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("rate")
    ) {
      return {
        message:
          "Our competitive rates vary by season and room type:\n\n💰 Standard Rooms: ₦25,000 - ₦35,000/night\n⭐ Premium Rooms: ₦35,000 - ₦50,000/night\n🏖️ Suites: ₦50,000 - ₦85,000/night\n\nPrices include breakfast, WiFi, and access to all facilities. We often have special packages and discounts available!",
        suggestions: ["View Packages", "Special Offers", "Group Discounts"],
      };
    }

    if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("where")
    ) {
      return {
        message:
          "🌍 We're located in the heart of Victoria Island, Lagos:\n\n📍 123 Landmark Boulevard, Victoria Island, Lagos, Nigeria\n🚗 5 minutes from Murtala Muhammed Airport\n🏢 Walking distance to major business districts\n🛍️ Close to shopping malls and entertainment\n\nWould you like directions or transport information?",
        suggestions: [
          "Get Directions",
          "Airport Shuttle",
          "Nearby Attractions",
        ],
      };
    }

    // Default responses for general conversation
    const generalResponses = [
      {
        message:
          "Thank you for your message! I'm here to help you with any questions about our services, bookings, or facilities. What would you like to know?",
        suggestions: ["Room Booking", "Facilities Info", "Contact Details"],
      },
      {
        message:
          "I'd be happy to assist you today! Whether you need help with reservations, information about our amenities, or have any concerns, I'm here for you.",
        suggestions: ["Make Reservation", "View Amenities", "Customer Support"],
      },
      {
        message:
          "Great to hear from you! How can I make your Landmark Africa experience exceptional today?",
        suggestions: ["Book a Room", "Dining Options", "Special Requests"],
      },
      {
        message:
          "Welcome! I'm your personal assistant for all things related to Landmark Africa. What can I help you with?",
        suggestions: ["Accommodation", "Services", "Local Information"],
      },
    ];

    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  }

  // Simulate API delay for realistic demo experience
  simulateDelay(min = 500, max = 1500) {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig() {
    return { ...this.config };
  }
}

// Export singleton instance
export const chatAPI = new ChatAPI();
export default chatAPI;
