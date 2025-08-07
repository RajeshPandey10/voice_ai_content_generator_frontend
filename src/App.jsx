import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { HowToUsePage } from "@/pages/HowToUsePage";
import { PricingPage } from "@/pages/PricingPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ContentDetailsPage } from "@/pages/ContentDetailsPage";
import { ContentGenerationPage } from "@/pages/ContentGenerationPage";
import { ContentChatPage } from "@/pages/ContentChatPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AuthForm } from "@/components/auth-form";
import { AuthSuccessPage } from "@/pages/AuthSuccessPage";
import { ProtectedRoute } from "@/components/protected-route";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Public Routes */}
                  <Route index element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/how-to-use" element={<HowToUsePage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/success" element={<AuthSuccessPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/content/generation"
                    element={
                      <ProtectedRoute>
                        <ContentGenerationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/content/chat"
                    element={
                      <ProtectedRoute>
                        <ContentChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/content/details"
                    element={
                      <ProtectedRoute>
                        <ContentDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/content/:id"
                    element={
                      <ProtectedRoute>
                        <ContentDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Auth Page Component
function AuthPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <AuthForm />
    </div>
  );
}

// 404 Page Component
function NotFoundPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default App;
