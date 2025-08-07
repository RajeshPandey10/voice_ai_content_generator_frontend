import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BusinessForm } from "@/components/business-form";
import { ResultsDisplay } from "@/components/results-display";
import { LoadingCard } from "@/components/loading-card";
import { ErrorCard } from "@/components/error-card";
import { Sparkles, Zap, Target, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { contentAPI } from "@/services/api";
import Cookies from "js-cookie";

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [result, setResult] = useState("");
  const [audioResult, setAudioResult] = useState(null);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
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
      Cookies.get("accessToken") ? "Token exists" : "No token"
    );

    setError("");
    setResult("");
    setLoading(true);
    setBusinessName(formData.business_name);

    try {
      const response = await contentAPI.generateContent(formData);
      setResult(response.data.result || "No content generated");
    } catch (err) {
      console.error("Content generation error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error("Sign In Required", {
        description: "Please sign in to generate audio from your content.",
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

    if (!result) {
      setError("Please generate content first before creating audio");
      return;
    }

    setError("");
    setAudioLoading(true);

    try {
      const token = Cookies.get("accessToken");
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://voice-ai-generator-backend.onrender.com";
      const response = await fetch(`${apiUrl}/api/audio/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: result,
          language: selectedLanguage,
          businessName: businessName,
          contentType: "business_description",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setAudioResult(data.audio);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate audio. Please try again."
      );
    } finally {
      setAudioLoading(false);
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

      {/* Form Section */}
      <div className="space-y-8">
        <BusinessForm onSubmit={handleSubmit} loading={loading} />

        {/* Loading State */}
        {loading && <LoadingCard />}

        {/* Error State */}
        {error && <ErrorCard error={error} onRetry={handleRetry} />}

        {/* Results */}
        <ResultsDisplay
          result={result}
          businessName={businessName}
          audioResult={audioResult}
          audioLoading={audioLoading}
          onGenerateAudio={handleGenerateAudio}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
    </div>
  );
}
