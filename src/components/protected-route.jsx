import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, LogIn } from "lucide-react";

export function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show sign-in prompt with redirect
  if (!isAuthenticated || !user) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-lg">
              Please sign in to access this page and enjoy all premium features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 max-w-sm mx-auto">
              <Button asChild className="w-full">
                <a
                  href={`/auth?redirect=${encodeURIComponent(
                    location.pathname
                  )}`}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/">Go to Home</a>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">✨ Benefits of signing in:</p>
              <ul className="space-y-1 text-left max-w-sm mx-auto">
                <li>• Save and access your content history</li>
                <li>• Track your usage and credits</li>
                <li>• Generate audio from your content</li>
                <li>• Premium features and higher limits</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, render the protected content
  return children;
}
