import React from "react";
import "./DemoPage.css";

const DemoPage = () => {
  return (
    <div className="demo-page">
      <div className="demo-container">
        <header className="demo-header">
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">🏨</div>
            </div>
            <h1>Landmark Africa</h1>
            <p>Premium Hospitality & Booking Services</p>
          </div>
        </header>

        <main className="demo-content">
          <section className="hero-section">
            <h2>Welcome to Our Luxury Experience</h2>
            <p>
              Experience world-class hospitality with our premium booking
              services. From luxury accommodations to exclusive experiences,
              we're here to make your stay unforgettable.
            </p>
            <div className="cta-buttons">
              <button className="cta-primary">Book Now</button>
              <button className="cta-secondary">View Packages</button>
            </div>
          </section>

          <section className="features-section">
            <h3>Our Services</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h4>Luxury Accommodations</h4>
                <p>Premium rooms and suites with world-class amenities</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h4>Fine Dining</h4>
                <p>Exquisite culinary experiences from renowned chefs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💆</div>
                <h4>Spa & Wellness</h4>
                <p>Rejuvenating treatments and wellness programs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎭</div>
                <h4>Entertainment</h4>
                <p>Exclusive events and entertainment options</p>
              </div>
            </div>
          </section>

          <section className="chat-demo-section">
            <div className="chat-demo-content">
              <h3>Need Help? Chat With Us!</h3>
              <p>
                Our AI-powered chat assistant is available 24/7 to help you
                with:
              </p>
              <ul>
                <li>🏨 Room bookings and availability</li>
                <li>ℹ️ Facility information and amenities</li>
                <li>🕐 Opening hours and schedules</li>
                <li>📞 Customer support and complaints</li>
                <li>🎯 Personalized recommendations</li>
              </ul>
              <p className="chat-instruction">
                👉{" "}
                <strong>
                  Look for the chat button in the bottom-right corner!
                </strong>
              </p>
            </div>
          </section>

          <section className="info-section">
            <div className="info-grid">
              <div className="info-card">
                <h4>📍 Location</h4>
                <p>Victoria Island, Lagos, Nigeria</p>
              </div>
              <div className="info-card">
                <h4>📞 Contact</h4>
                <p>+234 (0) 1 234 5678</p>
              </div>
              <div className="info-card">
                <h4>✉️ Email</h4>
                <p>info@landmarkafrica.com</p>
              </div>
              <div className="info-card">
                <h4>🕐 Hours</h4>
                <p>24/7 Available</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="demo-footer">
          <p>&copy; 2025 Landmark Africa. All rights reserved.</p>
          <p>Experience luxury, redefined.</p>
        </footer>
      </div>
    </div>
  );
};

export default DemoPage;
