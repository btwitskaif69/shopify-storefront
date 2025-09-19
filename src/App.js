// src/App.js
import TrackOrderPage from './components/TrackOrder';
import ContactUs from "./components/ContactUs";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // ✅ Added useLocation
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Preloader from './components/Preloader/Preloader';
import TopProducts from './components/TopProducts';
import ProductPage from './components/ProductPage';
import CollectionPage from './components/CollectionPage';
import ProductReviews from './components/ProductReviews';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CartPage from './components/CartPage';
import VideoModelSection from './components/VideoModelSection';
import UspShowcase from './components/UspShowcase';
import CategoriesSection from "./components/CategoriesSection";
import TrousersSection from './components/TrousersSection';
import ShortDressSection from './components/ShortDressSection';
import MaxiMidiDressSection from './components/MaxiMidiDressSection';
import CoOrdsSection from './components/CoOrdsSection';
import StickyNav from './components/StickyNav';
import StorySection from './components/StorySection';
import ShineSection from './components/ShineSection';
import AccountPage from './components/AccountPage';
import WatchAndBuy from './components/WatchAndBuy';
import IntractiveModelSection from './components/InteractiveModelSection';
import FlippingCard from './components/FlippingCard';
import HeroSlider from './components/HeroSlider'; 
import Marquee from "./components/Marquee";
import { ContactPage, PrivacyPolicyPage, TermsPage, ReturnsPage, AboutUsPage } from './pages/StaticPages';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AffiliatePage from './pages/AffiliatePage';
import CoOrds_Section from './components/CoOrds_Section';
import StatsCounter from './components/StatsCounter'; 
import './App.css';
import Sale from './components/Sale';
import Offer from './components/Offer';
import CuratedCollections from './components/CuratedCollections';


// ✅ Create MainLayout with useLocation to check current route
const MainLayout = ({ children }) => {
  const location = useLocation(); // ✅ get current URL

  return (
    <>
      {/* Show Marquee only on homepage */}
      {location.pathname === "/" && <Marquee />}
      
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <HeroSlider /> 
      <CategoriesSection />
      <IntractiveModelSection />
      <StatsCounter /> {/* Stats Counter Component */}
      <CoOrds_Section />
      <section id="top-products-section">
        <TopProducts />
      </section>

      
      <StickyNav />
      
      
      <section id="trousers-section">
        <TrousersSection />
      </section>

      <VideoModelSection /> 

      <section id="short-dress-section">
        <ShortDressSection />
      </section>
      
      <section id="maxi-midi-dress-section">
        <MaxiMidiDressSection />
      </section>
      {/* <CuratedCollections/> */}
      <div className="hide-on-mobile">
        <UspShowcase />
      </div>
       <WatchAndBuy />

       <Offer/>

      <section id="reviews-section">
        <ProductReviews />
      </section>

      <div className="App">
        <FlippingCard />
      </div>
      <Sale/>
      <ShineSection text="Own It #TrustYourStyle" />
    </>
  );
};


function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // --- AFFILIATE TRACKING ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const affiliateCode = params.get('ref');
    if (affiliateCode) {
      document.cookie = `goaffpro_ref=${affiliateCode}; max-age=2592000; path=/; SameSite=Lax;`;
    }
  }, []);
  // --- END AFFILIATE TRACKING ---

  const handlePreloaderFinish = () => {
    console.log("Preloader video finished, loading site...");
    setPreloaderDone(true);
  };

  return (
    <>
      {!preloaderDone ? (
        <Preloader onVideoEnd={handlePreloaderFinish} />
      ) : (
        <Router>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route
                  path="/tools/track-order"
                  element={
                    <MainLayout>
                      <TrackOrderPage />
                    </MainLayout>
                  }
                />

                {/* Main Routes */}
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <HomePage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/products/:handle"
                  element={
                    <MainLayout>
                      <ProductPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/collections/:handle"
                  element={
                    <MainLayout>
                      <CollectionPage />
                    </MainLayout>
                  }
                />

                {/* Footer Page Routes */}
                <Route
                  path="/contact"
                  element={
                    <MainLayout>
                      <ContactUs />
                    </MainLayout>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <MainLayout>
                      <PrivacyPolicyPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/terms-conditions"
                  element={
                    <MainLayout>
                      <TermsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/returns-exchange"
                  element={
                    <MainLayout>
                      <ReturnsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/about-us"
                  element={
                    <MainLayout>
                      <AboutUsPage />
                    </MainLayout>
                  }
                />

                {/* Dynamic Blog Routes */}
                <Route
                  path="/blogs/:handle"
                  element={
                    <MainLayout>
                      <BlogPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/blogs/:blogHandle/:articleHandle"
                  element={
                    <MainLayout>
                      <BlogPostPage />
                    </MainLayout>
                  }
                />

                {/* Account Routes */}
                <Route
                  path="/account/login"
                  element={
                    <MainLayout>
                      <LoginPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/account/register"
                  element={
                    <MainLayout>
                      <SignUpPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <MainLayout>
                      <AccountPage />
                    </MainLayout>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <MainLayout>
                      <CartPage />
                    </MainLayout>
                  }
                />

                {/* Affiliate Program Route */}
                <Route
                  path="/affiliate-program"
                  element={
                    <MainLayout>
                      <AffiliatePage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/collections/sale"
                  element={
                    <MainLayout>
                      <Sale />
                    </MainLayout>
                  }
                />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </Router>
      )}
    </>
  );
}

export default App;
