import TrackOrderPage from './components/TrackOrder';
import ContactUs from "./components/ContactUs";

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Preloader from './components/Preloader/Preloader';
import WhyChooseUs from './components/WhyChooseUs';
import InteractiveModelSection from './components/InteractiveModelSection';
import TopProducts from './components/TopProducts';
import ProductPage from './components/ProductPage';
import CollectionPage from './components/CollectionPage';
import ProductReviews from './components/ProductReviews';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CartPage from './components/CartPage';

// Import the static pages
import {
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  ReturnsPage,
  AboutUsPage
} from './pages/StaticPages';

// Import the new dynamic blog components
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AffiliatePage from './pages/AffiliatePage'; // Import the new affiliate page

import './App.css';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const HomePage = () => {
    const nextSectionRef = React.useRef(null);
    return (
        <>
            <div className="hero-banner">
                <video 
                    src="/videos/intro.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="hero-video"
                />
                <div className="hero-content">
                    <h1>Timeless Elegance, Modern Sophistication</h1>
                    <p>For the moments that matter.</p>
                </div>
            </div>
            <WhyChooseUs />
            <InteractiveModelSection nextSectionRef={nextSectionRef} />
            <div ref={nextSectionRef}><TopProducts /></div>
            <ProductReviews />
        </>
    );
};

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- AFFILIATE TRACKING ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const affiliateCode = params.get('ref');
    if (affiliateCode) {
      document.cookie = `goaffpro_ref=${affiliateCode}; max-age=2592000; path=/; SameSite=Lax`;
    }
  }, []);
  // --- END AFFILIATE TRACKING ---

  return (
    <>
      {loading && <Preloader />}
      {!loading && (
        <Router>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/tools/track-order" element={<MainLayout><TrackOrderPage /></MainLayout>} />

                {/* Main Routes */}
                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                <Route path="/products/:handle" element={<MainLayout><ProductPage /></MainLayout>} />
                <Route path="/collections/:handle" element={<MainLayout><CollectionPage /></MainLayout>} />
                
                {/* Footer Page Routes */}
                <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
                <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicyPage /></MainLayout>} />
                <Route path="/terms-conditions" element={<MainLayout><TermsPage /></MainLayout>} />
                <Route path="/returns-exchange" element={<MainLayout><ReturnsPage /></MainLayout>} />
                <Route path="/about-us" element={<MainLayout><AboutUsPage /></MainLayout>} />

                {/* Dynamic Blog Routes */}
                <Route path="/blogs/:handle" element={<MainLayout><BlogPage /></MainLayout>} />
                <Route path="/blogs/:blogHandle/:articleHandle" element={<MainLayout><BlogPostPage /></MainLayout>} />

                {/* Account Routes */}
                <Route path="/account/login" element={<MainLayout><LoginPage /></MainLayout>} />
                <Route path="/account/register" element={<MainLayout><SignUpPage /></MainLayout>} />
                <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />

                {/* Affiliate Program Route */}
                <Route path="/affiliate-program" element={<MainLayout><AffiliatePage /></MainLayout>} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </Router>
      )}
    </>
  );
}

export default App;
