import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import appStyles from "../styles/app.module.css";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className={appStyles.appRoot}>
      <ErrorBoundary>
        <Router>
          <Header onOpenSidebar={() => setSidebarOpen(true)} />
          <main className={appStyles.mainContent}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/register" element={<Register />} />
            </Routes>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </main>
          <Footer />
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;
