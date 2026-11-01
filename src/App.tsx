import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { CounterLayout } from './components/layout/CounterLayout';
import { OperatorLayout } from './components/layout/OperatorLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { SearchPage } from './pages/public/SearchPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { ConfirmationPage } from './pages/public/ConfirmationPage';
import { TicketPage } from './pages/public/TicketPage';
import { TrackBookingPage } from './pages/public/TrackBookingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ContactPage } from './pages/public/ContactPage';
import { FAQPage } from './pages/public/FAQPage';
import { TermsPage, PrivacyPage, RefundPolicyPage } from './pages/public/RefundPolicyPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyBookings } from './pages/customer/MyBookings';
import { CustomerProfile, CustomerNotifications } from './pages/customer/CustomerProfile';

// Counter Staff & Manager Pages
import { CounterPosPage } from './pages/counter/CounterPosPage';
import { CounterShiftsPage } from './pages/counter/CounterShiftsPage';
import { CounterSearchPage } from './pages/counter/CounterSearchPage';
import { CounterDailySalesPage } from './pages/counter/CounterDailySalesPage';
import { CounterManagerPage } from './pages/counter/CounterManagerPage';

// Operator Admin Pages
import { OperatorDashboard } from './pages/operator/OperatorDashboard';
import { OperatorBusesPage } from './pages/operator/OperatorBusesPage';
import { OperatorLayoutsPage } from './pages/operator/OperatorLayoutsPage';
import { OperatorRoutesPage, OperatorReportsPage } from './pages/operator/OperatorRoutesPage';
import { OperatorTripsPage } from './pages/operator/OperatorTripsPage';

// Central & Super Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOperatorsPage } from './pages/admin/AdminOperatorsPage';
import { AdminStationsPage } from './pages/admin/AdminStationsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminCancellationsPage } from './pages/admin/AdminCancellationsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/booking-confirmation/:bookingId" element={<ConfirmationPage />} />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
            <Route path="/track-booking" element={<TrackBookingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
          </Route>

          {/* Customer Dashboard */}
          <Route path="/dashboard" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="notifications" element={<CustomerNotifications />} />
          </Route>

          {/* Counter Staff POS */}
          <Route path="/counter" element={<CounterLayout />}>
            <Route index element={<CounterPosPage />} />
            <Route path="shift" element={<CounterShiftsPage />} />
            <Route path="search" element={<CounterSearchPage />} />
            <Route path="daily-sales" element={<CounterDailySalesPage />} />
          </Route>

          {/* Counter Manager */}
          <Route path="/counter-manager" element={<CounterLayout />}>
            <Route index element={<CounterManagerPage />} />
          </Route>

          {/* Operator Admin */}
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<OperatorDashboard />} />
            <Route path="buses" element={<OperatorBusesPage />} />
            <Route path="layouts" element={<OperatorLayoutsPage />} />
            <Route path="routes" element={<OperatorRoutesPage />} />
            <Route path="trips" element={<OperatorTripsPage />} />
            <Route path="reports" element={<OperatorReportsPage />} />
          </Route>

          {/* Super & Central Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="operators" element={<AdminOperatorsPage />} />
            <Route path="stations" element={<AdminStationsPage />} />
            <Route path="routes" element={<OperatorRoutesPage />} />
            <Route path="buses" element={<OperatorBusesPage />} />
            <Route path="trips" element={<OperatorTripsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="cancellations" element={<AdminCancellationsPage />} />
            <Route path="reports" element={<OperatorReportsPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
