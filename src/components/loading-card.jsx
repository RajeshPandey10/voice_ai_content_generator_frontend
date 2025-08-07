import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export function LoadingCard() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Generating Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <div className="text-center space-y-2">
            <p className="font-medium">
              Creating your voice-optimized content...
            </p>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full w-1/3 animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
