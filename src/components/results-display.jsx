import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "./audio-player";
import { ImprovedAudioPlayer } from "./improved-audio-player";
import { ContentChatModifier } from "@/components/content-chat-modifier";
import { useAuth } from "@/contexts/AuthContext";
import {
  Copy,
  Download,
  CheckCircle,
  FileText,
  Sparkles,
  Volume2,
  Languages,
  Loader2,
  MessageCircle,
} from "lucide-react";

export function ResultsDisplay({
  result,
  businessName,
  audioResult,
  onGenerateAudio,
  audioLoading = false,
  selectedLanguage = "en",
  onLanguageChange,
}) {
  const [copied, setCopied] = useState(false);
  const [showChatModifier, setShowChatModifier] = useState(false);
  const [currentContent, setCurrentContent] = useState(result);
  const { user } = useAuth();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${businessName.replace(/\s+/g, "_")}_content.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleDownloadAudio = () => {
    if (audioResult) {
      const link = document.createElement("a");
      const audioUrl = audioResult.url.startsWith("http")
        ? audioResult.url
        : `${
            import.meta.env.VITE_API_URL ||
            "https://voice-ai-generator-backend.onrender.com"
          }${audioResult.url}`;

      link.href = audioUrl;
      link.download = `${businessName.replace(/\s+/g, "_")}_audio.mp3`;
      link.target = "_blank"; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Update current content when result changes - MUST be before any conditional returns
  React.useEffect(() => {
    setCurrentContent(result);
  }, [result]);

  const canGenerateAudio = () => {
    if (!user) return false;

    const subscription = user.subscription || {};

    // Pro Plus has unlimited generations
    if (subscription.plan === "pro_plus") return true;

    // Check if user has remaining audio credits
    const audioUsage = subscription.usageCount?.audio || 0;
    const audioLimit = subscription.monthlyLimits?.audio || 0;

    return audioUsage < audioLimit;
  };

  // Don't render if no result
  if (!result) {
    return null;
  }

  const handleContentUpdate = (newContent) => {
    setCurrentContent(newContent);
  };

  if (!result) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Generated Content
        </CardTitle>
        <CardDescription>
          Voice-optimized business description and FAQs ready for your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-6 border">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {currentContent}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Text
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download TXT
          </Button>

          <Button
            onClick={() => setShowChatModifier(!showChatModifier)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {showChatModifier ? "Hide AI Chat" : "Modify with AI"}
          </Button>

          {!audioResult && (
            <Button
              onClick={() => {
                if (onGenerateAudio && typeof onGenerateAudio === "function") {
                  onGenerateAudio();
                }
              }}
              disabled={audioLoading || !canGenerateAudio()}
              className="flex items-center gap-2"
            >
              {audioLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Generate Audio
                  <Badge variant="secondary" className="ml-1">
                    {selectedLanguage === "en" ? "EN" : "NE"}
                  </Badge>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Usage Warning for Free Users */}
        {user && user.subscription?.plan === "free" && !canGenerateAudio() && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium">
                Audio Generation Limit Reached
              </span>
            </div>
            <p className="text-sm text-orange-600/70 dark:text-orange-400/70 mt-1">
              You've used all your free audio generations this month.{" "}
              <Link
                to="/pricing"
                className="text-orange-600 dark:text-orange-400 underline hover:no-underline"
              >
                Upgrade to Pro
              </Link>{" "}
              to generate more audio.
            </p>
          </div>
        )}

        {/* Audio Player */}
        {audioResult && (
          <ImprovedAudioPlayer
            audioData={audioResult}
            language={selectedLanguage === "ne" ? "Nepali" : "English"}
          />
        )}

        {/* Chat Modifier */}
        {showChatModifier && user && (
          <ContentChatModifier
            originalContent={result}
            businessName={businessName}
            onContentUpdate={handleContentUpdate}
            className="mt-6"
          />
        )}
      </CardContent>
    </Card>
  );
}
