import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getApiUrl } from "@/utils/apiUrl";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Copy,
  Download,
  Volume2,
  VolumeX,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import Cookies from "js-cookie";

export function ContentChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get data from navigation state
  const { content, businessData, audioResult } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState(content || "");
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(audioResult || null);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Redirect if no content data
  useEffect(() => {
    if (!content || !businessData) {
      navigate("/");
      return;
    }

    // Initialize with the original content
    setMessages([
      {
        id: 1,
        type: "assistant",
        content: content,
        timestamp: new Date(),
      },
    ]);
  }, [content, businessData, navigate]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const token = Cookies.get("accessToken");
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/content/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalContent: currentContent,
          modification: currentMessage,
          businessData: businessData,
        }),
      });

      const data = await response.json();

      if (data.success && data.modifiedContent) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: "assistant",
          content: data.modifiedContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentContent(data.modifiedContent);
        toast.success("Content modified successfully!");
      } else {
        throw new Error(data.error || "Failed to modify content");
      }
    } catch (error) {
      console.error("Modification error:", error);
      toast.error("Failed to modify content. Please try again.");

      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          "Sorry, I couldn't process your request. Please try again with a different modification.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!user) {
      toast.error("Authentication required to generate audio");
      return;
    }

    if (!currentContent || currentContent.trim().length < 5) {
      toast.error("Content too short", {
        description:
          "The content must be at least 5 characters long to generate audio.",
      });
      return;
    }

    console.log("Generating audio for current content:", {
      contentLength: currentContent.length,
      contentPreview: currentContent.substring(0, 100) + "...",
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
          content: currentContent.trim(),
          language: "en", // You can make this dynamic
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

      if (data.success && data.audioFile) {
        setCurrentAudio(data);
        toast.success("Audio generated successfully!");
      } else {
        throw new Error(data.error || "Failed to generate audio");
      }
    } catch (error) {
      console.error("Audio generation error:", error);
      toast.error(
        error.message || "Failed to generate audio. Please try again."
      );
    } finally {
      setAudioLoading(false);
    }
  };

  const handleDownloadAudio = () => {
    if (currentAudio?.audioFile) {
      const link = document.createElement("a");
      const apiUrl = getApiUrl();
      const audioUrl = currentAudio.audioFile.startsWith("http")
        ? currentAudio.audioFile
        : `${apiUrl}${currentAudio.audioFile}`;
      link.href = audioUrl;
      link.download = `content-audio-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard!");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/content/generation")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Content Chat & Modify
              </h1>
              <p className="text-muted-foreground">
                Chat with AI to modify your content for{" "}
                <strong>{businessData?.businessName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateAudio}
                disabled={audioLoading}
              >
                {audioLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                Generate Audio
              </Button>

              {currentAudio && (
                <Button variant="outline" onClick={handleDownloadAudio}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Content Modification Chat
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.type === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {message.type === "user" ? (
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          <div
                            className={`rounded-lg p-3 ${
                              message.type === "user"
                                ? "bg-blue-500 text-white"
                                : message.isError
                                ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div
                                className={`text-xs ${
                                  message.type === "user"
                                    ? "text-blue-100"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatTimestamp(message.timestamp)}
                              </div>
                              {message.type === "assistant" &&
                                !message.isError && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(message.content)
                                    }
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your modification request... (e.g., 'Make it more professional', 'Add pricing information', 'Translate to Nepali')"
                      className="min-h-[60px] resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !currentMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Content Preview */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Current Content</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    <pre className="whitespace-pre-wrap font-sans">
                      {currentContent}
                    </pre>
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(currentContent)}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Content
                  </Button>

                  {currentAudio && (
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Generated Audio
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownloadAudio}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <audio
                        ref={audioRef}
                        controls
                        className="w-full"
                        src={
                          currentAudio.audioFile?.startsWith("http")
                            ? currentAudio.audioFile
                            : `${
                                import.meta.env.VITE_API_URL ||
                                "https://voice-ai-generator-backend.onrender.com"
                              }${currentAudio.audioFile}`
                        }
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
