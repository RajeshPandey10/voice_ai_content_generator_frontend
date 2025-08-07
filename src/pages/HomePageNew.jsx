import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BusinessForm } from "@/components/business-form";
import { LoadingCard } from "@/components/loading-card";
import { ErrorCard } from "@/components/error-card";
import {
  Sparkles,
  Zap,
  Target,
  Globe,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { contentAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error("Sign In Required", {
        description:
          "Please sign in to generate premium AI content and access all features.",
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
        duration: 5000,
      });

      // Redirect to auth page after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 1000);

      return;
    }

    console.log("User authenticated:", {
      isAuthenticated,
      user: user?.email || "No email",
    });
    console.log(
      "Available token:",
      Cookies.get("accessToken") ? "Present" : "Missing"
    );

    setLoading(true);
    setError("");

    try {
      const response = await contentAPI.generateContent(formData);

      if (response.success && response.content) {
        toast.success("Content generated successfully!");

        // Navigate to content generation page with the results
        navigate("/content/generation", {
          state: {
            generatedContent: response.content,
            businessData: formData,
          },
        });
      } else {
        throw new Error(response.error || "Failed to generate content");
      }
    } catch (err) {
      console.error("Content generation error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Content Generation
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Generate voice search optimized business descriptions and FAQs
          tailored for Nepali small and medium enterprises
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Generate professional content in seconds using advanced AI
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Voice Optimized</h3>
            <p className="text-sm text-muted-foreground">
              Content optimized for voice search and local SEO
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Globe className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Nepal Focused</h3>
            <p className="text-sm text-muted-foreground">
              Specifically designed for Nepali businesses and market
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons for Existing Users */}
      {isAuthenticated && (
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  View My Content
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generation Form Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Generate Your Content</h2>
          <p className="text-muted-foreground">
            Fill in your business details below to generate AI-powered content
          </p>
        </div>

        {/* Form */}
        <BusinessForm onSubmit={handleSubmit} loading={loading} />

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <LoadingCard />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Generating your content... This usually takes 10-15 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && <ErrorCard error={error} onRetry={handleRetry} />}
      </div>

      {/* Benefits Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-8">
          Why Choose Our AI Content Generator?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Premium Quality</h4>
            <p className="text-sm text-muted-foreground">
              Professional-grade content powered by advanced AI models
            </p>
          </div>
          <div className="p-4">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Instant Results</h4>
            <p className="text-sm text-muted-foreground">
              Get your content generated in under 15 seconds
            </p>
          </div>
          <div className="p-4">
            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Localized Content</h4>
            <p className="text-sm text-muted-foreground">
              Tailored specifically for the Nepali business market
            </p>
          </div>
          <div className="p-4">
            <Target className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">SEO Optimized</h4>
            <p className="text-sm text-muted-foreground">
              Voice search and local SEO ready content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
