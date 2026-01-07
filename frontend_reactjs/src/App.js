import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { warnIfMissingBackend } from "./config/env";

// PUBLIC_INTERFACE
function App() {
  /** Application root with routing and shared layout. */
  useEffect(() => {
    warnIfMissingBackend();
  }, []);

  return (
    <BrowserRouter>
      <div className="appShell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
