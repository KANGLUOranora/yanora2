import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AnalyticsProvider } from './contexts/AnalyticsContext.tsx';
import { VisitorTrackingProvider } from './contexts/VisitorTrackingContext.tsx';
import App from './App.tsx';
import BookingPage from './components/BookingPage.tsx';
import PaymentPage from './components/PaymentPage.tsx';
import BookingSuccessPage from './components/BookingSuccessPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import AdminLoginPage from './components/AdminLoginPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import FacialContourPage from './components/FacialContourPage.tsx';
import BodySculptingPage from './components/BodySculptingPage.tsx';
import InjectionLiftingPage from './components/InjectionLiftingPage.tsx';
import HairTransplantPage from './components/HairTransplantPage.tsx';
import DentalPage from './components/DentalPage.tsx';
import FAQPage from './components/FAQPage.tsx';
import CasesPage from './components/CasesPage.tsx';
import PrivacyPolicyPage from './components/PrivacyPolicyPage.tsx';
import AfterSalesPage from './components/AfterSalesPage.tsx';
import CardDemo from './components/CardDemo.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <VisitorTrackingProvider>
            <AnalyticsProvider>
              <ScrollToTop />
              <Routes>
            <Route path="/" element={<App />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/booking/success" element={<BookingSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/facial-contour" element={<FacialContourPage />} />
            <Route path="/body-sculpting" element={<BodySculptingPage />} />
            <Route path="/injection-lifting" element={<InjectionLiftingPage />} />
            <Route path="/hair-transplant" element={<HairTransplantPage />} />
            <Route path="/dental" element={<DentalPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/after-sales" element={<AfterSalesPage />} />
            <Route path="/card-demo" element={<CardDemo />} />
            </Routes>
            </AnalyticsProvider>
          </VisitorTrackingProvider>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>
);
