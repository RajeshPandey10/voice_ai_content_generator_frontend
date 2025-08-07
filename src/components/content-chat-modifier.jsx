import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { contentAPI } from "@/services/api";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  RefreshCw,
  Copy,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export function ContentChatModifier({
  originalContent,
  businessName,
  onContentUpdate,
  className = "",
}) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send message to AI for content modification
      const response = await contentAPI.modifyContent({
        originalContent,
        businessName,
        userRequest: inputMessage,
        conversationHistory: messages,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.modifiedContent,
        timestamp: new Date(),
        modifications: response.data.modifications || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update the content in parent component
      if (onContentUpdate) {
        onContentUpdate(response.data.modifiedContent);
      }

      toast.success("Content updated successfully!");
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to modify content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy content");
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  const quickSuggestions = [
    "Make it more professional",
    "Add more keywords for SEO",
    "Make it shorter and concise",
    "Add emotional appeal",
    "Include more local references",
    "Make it more conversational",
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-500" />
          AI Content Modifier
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Chat with AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-sm mb-4">
              Ask me to modify your content. I can help make it more
              professional, add keywords, change the tone, or make any other
              improvements.
            </p>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : message.type === "error"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "user" ? (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.type === "ai" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyContent(message.content)}
                              className="h-6 text-xs"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to modify your content... (e.g., 'Make it more professional' or 'Add more SEO keywords')"
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  onClick={handleResetChat}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
