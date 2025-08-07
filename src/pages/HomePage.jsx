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
import { useLanguage } from "@/contexts/LanguageContext";
import { contentAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFormData, setLastFormData] = useState(null); // Store last form data for retry
  const { user, isAuthenticated } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLastFormData(formData); // Store form data for retry

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
      // Add language preference to form data
      const formDataWithLanguage = {
        ...formData,
        preferredLanguage: currentLanguage,
      };

      const response = await contentAPI.generateContent(formDataWithLanguage);

      console.log("API Response:", response.data); // Debug log

      if (response.data.success && response.data.content) {
        toast.success("Content generated successfully!");

        // Navigate to content generation page with the results
        navigate("/content/generation", {
          state: {
            generatedContent: response.data.content,
            businessData: formData,
          },
        });
      } else {
        throw new Error(response.data.error || "Failed to generate content");
      }
    } catch (err) {
      console.error("Content generation error:", err);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    if (lastFormData) {
      // Re-submit with the last form data
      handleSubmit(lastFormData);
    } else {
      toast.error("No previous form data found. Please fill the form again.");
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("voiceScriptsGenerator") || "AI-Powered Content Generation"}
          </h1>
        </div>
        {/* <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          {t("generateVoiceOptimized") ||
            "Generate voice search optimized business descriptions and FAQs tailored for Nepali small and medium enterprises"}
        </p> */}

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              {t("lightningFast")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("lightningFastDesc")}
            </p>
          </div>
          <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              {t("voiceOptimized")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("voiceOptimizedDesc")}
            </p>
          </div>
          <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              {t("nepalFocused")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("nepalFocusedDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons for Existing Users */}
      {isAuthenticated && (
        <div className="mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("viewMyContent")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  {t("upgradePlan")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generation Form Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {t("generateContent")}
          </h2>
          <p className="text-muted-foreground">{t("fillBusinessDetails")}</p>
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
        <h3 className="text-2xl font-semibold mb-8">{t("whyChooseTitle")}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">{t("premiumQuality")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("premiumQualityDesc")}
            </p>
          </div>
          <div className="p-4">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">{t("instantResults")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("instantResultsDesc")}
            </p>
          </div>
          <div className="p-4">
            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">{t("localizedContent")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("localizedContentDesc")}
            </p>
          </div>
          <div className="p-4">
            <Target className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">{t("voiceOptimized")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("voiceOptimizedDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
