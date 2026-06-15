import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute    from "./components/layout/ProtectedRoute";
import AppLayout         from "./components/layout/AppLayout";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import DashboardPage     from "./pages/DashboardPage";
import TransactionsPage  from "./pages/TransactionsPage";
import BudgetsPage       from "./pages/BudgetsPage";
import AnalyticsPage     from "./pages/AnalyticsPage";
import { ProfilePage, SettingsPage } from "./pages/ProfileSettingsPages";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<LoginPage />}    />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — all share AppLayout (topbar + footer) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard"    element={<DashboardPage />}    />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/budgets"      element={<BudgetsPage />}      />
                <Route path="/analytics"    element={<AnalyticsPage />}    />
                <Route path="/profile"      element={<ProfilePage />}      />
                <Route path="/settings"     element={<SettingsPage />}     />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="/"   element={<Navigate to="/dashboard" replace />} />
            <Route path="*"   element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
