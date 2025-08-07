import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentChatModifier } from "@/components/content-chat-modifier";
import { ImprovedAudioPlayer } from "@/components/improved-audio-player";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { getApiUrl } from "@/utils/apiUrl";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building,
  Users,
  Copy,
  Download,
  Play,
  Pause,
  Volume2,
  Loader2,
  Star,
  Infinity,
  MessageCircle,
} from "lucide-react";
import Cookies from "js-cookie";

export function ContentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [rating, setRating] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showChatModifier, setShowChatModifier] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  useEffect(() => {
    fetchContentDetails();
    return () => {
      // Cleanup audio when component unmounts
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [id]);

  const fetchContentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/${id}`);
      const contentData = response.data.content || response.data; // Handle both formats

      console.log("Fetched content data:", contentData); // Debug log

      setContent(contentData);
      setCurrentContent(contentData.generatedContent || "");
      setRating(contentData.rating || 0);

      // Check if there's already audio generated for this content
      if (contentData.audioFile || contentData.audioUrl) {
        setAudioResult({
          url: contentData.audioFile || contentData.audioUrl,
          filename: contentData.audioFilename || `audio_${id}.mp3`,
          language: contentData.businessDetails?.preferredLanguage || "en",
          duration: contentData.audioDuration || null,
          fileSize: contentData.audioFileSize || null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch content details:", error);
      toast.error("Failed to load content details");
      navigate("/history");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Sign In Required", {
        description: "Please sign in to generate audio from your content.",
      });
      return;
    }

    if (!content?.generatedContent) {
      toast.error("No content available to generate audio");
      return;
    }

    // Validate content length
    const contentText = content.generatedContent.trim();
    if (contentText.length < 5) {
      toast.error("Content too short", {
        description:
          "The content must be at least 5 characters long to generate audio.",
      });
      return;
    }

    console.log("Generating audio for content:", {
      contentLength: contentText.length,
      contentPreview: contentText.substring(0, 100) + "...",
      businessName: content.businessDetails?.businessName,
      language: selectedLanguage,
    });

    setAudioLoading(true);

    try {
      const token = Cookies.get("accessToken");
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/audio/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: contentText,
          language: selectedLanguage,
          businessName: content.businessDetails?.businessName,
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
      console.error("Audio generation error:", err);
      toast.error(err.message || "Failed to generate audio. Please try again.");
    } finally {
      setAudioLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (!audioResult?.url) return;

    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const apiUrl = getApiUrl();
      const audioUrl = audioResult.url.startsWith("http")
        ? audioResult.url
        : `${apiUrl}${audioResult.url}`;
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      setAudio(audioElement);
      setIsPlaying(true);

      audioElement.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };

      audioElement.onerror = () => {
        toast.error("Failed to play audio");
        setIsPlaying(false);
        setAudio(null);
      };
    }
  };

  const handleCopy = () => {
    if (content?.generatedContent) {
      navigator.clipboard.writeText(content.generatedContent);
      toast.success("Content copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (content?.generatedContent) {
      const blob = new Blob([content.generatedContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${content.businessDetails?.businessName || "content"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAudio = () => {
    if (audioResult?.url) {
      const a = document.createElement("a");
      const apiUrl = getApiUrl();
      const audioUrl = audioResult.url.startsWith("http")
        ? audioResult.url
        : `${apiUrl}${audioResult.url}`;
      a.href = audioUrl;
      a.download = audioResult.filename || "audio.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRating = async (newRating) => {
    try {
      await api.patch(`/api/${id}/rate`, { rating: newRating });
      setRating(newRating);
      toast.success("Rating saved!");
    } catch (error) {
      console.error("Failed to save rating:", error);
      toast.error("Failed to save rating");
    }
  };

  const handleContentUpdate = (newContent) => {
    setCurrentContent(newContent);
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Content Not Found
            </h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              The content you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link to="/history">Back to History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/history")}
          className="mb-4"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Button>
        <h1 className="text-3xl font-bold">Content Details</h1>
      </div>

      {/* Business Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {content.businessDetails?.businessName || "Generated Content"}
            </span>
            <Badge variant="secondary">
              {content.businessDetails?.businessType || "Content"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                {content.businessDetails?.location || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                {content.createdAt
                  ? new Date(content.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown Date"}
              </span>
            </div>
            {content.businessDetails?.targetCustomers && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {content.businessDetails.targetCustomers}
                </span>
              </div>
            )}
            {content.businessDetails?.productsServices && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {content.businessDetails.productsServices}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">
              Generated Content
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Copy</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChatModifier(!showChatModifier)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {showChatModifier ? "Hide AI Chat" : "Modify with AI"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg border">
            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {currentContent ||
                content.generatedContent ||
                "No content available"}
            </p>
          </div>

          {/* Chat Modifier */}
          {showChatModifier && (
            <div className="mt-6">
              <ContentChatModifier
                originalContent={content.generatedContent}
                businessName={content.businessDetails?.businessName}
                onContentUpdate={handleContentUpdate}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!audioResult ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Generate audio from this content to listen or download
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center mb-4">
                <label className="text-sm font-medium">Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-foreground min-w-[120px]"
                >
                  <option value="en">English</option>
                  <option value="ne">Nepali</option>
                </select>
              </div>
              <Button
                onClick={handleGenerateAudio}
                disabled={audioLoading}
                className="w-full sm:w-auto"
              >
                {audioLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>
            </div>
          ) : (
            <ImprovedAudioPlayer
              audioData={audioResult}
              language={selectedLanguage === "en" ? "English" : "Nepali"}
            />
          )}
        </CardContent>
      </Card>

      {/* Rating Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Rate this Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`h-8 w-8 p-1 rounded hover:bg-accent transition-colors ${
                    star <= rating
                      ? "text-yellow-500 fill-current"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <Star className="h-full w-full" />
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating > 0 ? `${rating}/5 stars` : "Not rated yet"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
