import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ResultsDisplay } from "@/components/results-display";
import { LoadingCard } from "@/components/loading-card";
import { ErrorCard } from "@/components/error-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Download, Share, Edit } from "lucide-react";
import Cookies from "js-cookie";

export function ContentGenerationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get data from navigation state
  const { generatedContent, businessData } = location.state || {};

  const [audioLoading, setAudioLoading] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Redirect if no content data
  if (!generatedContent || !businessData) {
    navigate("/");
    return null;
  }

  const handleGenerateAudio = async () => {
    if (!user) {
      toast.error("Authentication required to generate audio");
      return;
    }

    if (!generatedContent || generatedContent.trim().length < 5) {
      toast.error("Content too short", {
        description:
          "The content must be at least 5 characters long to generate audio.",
      });
      return;
    }

    console.log("Generating audio for content:", {
      contentLength: generatedContent.length,
      contentPreview: generatedContent.substring(0, 100) + "...",
      businessName: businessData.businessName,
      language: selectedLanguage,
    });

    setAudioLoading(true);
    setError("");

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
          content: generatedContent.trim(),
          language: selectedLanguage,
          businessName: businessData.businessName,
          contentType: "business_description",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Audio generation error:", errorData);

        // Show specific validation errors
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details
            .map((detail) => detail.msg)
            .join(", ");
          throw new Error(errorMessages);
        }

        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setAudioResult(data.audio);

      toast.success("Audio generated successfully!");
    } catch (err) {
      const errorMessage =
        err.message || "Failed to generate audio. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleContinueToChat = () => {
    navigate("/content/chat", {
      state: {
        content: generatedContent,
        businessData,
        audioResult,
      },
    });
  };

  const handleRetry = () => {
    setError("");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToHome")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ {t("contentGeneratedSuccessfully")}!
            </CardTitle>
            <p className="text-muted-foreground">
              {t("contentReadyMessage")}{" "}
              <strong>{businessData.businessName}</strong>{" "}
              {t("contentReadyMessageEnd")}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Error State */}
      {error && <ErrorCard error={error} onRetry={handleRetry} />}

      {/* Results Display */}
      <div className="space-y-6">
        <ResultsDisplay
          result={generatedContent}
          businessName={businessData.businessName}
          audioResult={audioResult}
          audioLoading={audioLoading}
          onGenerateAudio={handleGenerateAudio}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleContinueToChat}
                className="flex-1 min-w-[200px]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chat & Modify Content
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/history")}
                className="flex-1 min-w-[200px]"
              >
                <Download className="h-4 w-4 mr-2" />
                {t("viewAllContent")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
