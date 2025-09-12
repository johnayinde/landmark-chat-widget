import React from "react";
import ChatWidget from "./components/ChatWidget";
import DemoPage from "./components/DemoPage";

function App() {
  return (
    <div className="App">
      {/* Main page content */}
      <DemoPage />

      {/* Chat widget - will float over the page */}
      <ChatWidget />
    </div>
  );
}

export default App;
