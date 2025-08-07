import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Download,
  Volume2,
  Clock,
  FileAudio,
  Languages,
  AlertCircle,
} from "lucide-react";

export function AudioPlayer({ audioData, onDownload }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  // Construct the audio URL properly
  const audioUrl = audioData?.url || audioData?.audioFile;
  const fullAudioUrl = audioUrl
    ? audioUrl.startsWith("http")
      ? audioUrl
      : `${
          import.meta.env.VITE_API_URL ||
          "https://voice-ai-generator-backend.onrender.com"
        }${audioUrl}`
    : null;

  // Debug logging
  useEffect(() => {
    console.log("AudioPlayer received data:", audioData);
    console.log("Constructed audio URL:", fullAudioUrl);

    // Test if URL is accessible
    if (fullAudioUrl) {
      fetch(fullAudioUrl, { method: "HEAD" })
        .then((response) => {
          console.log("Audio URL test - Status:", response.status);
          console.log("Audio URL test - Headers:", response.headers);
        })
        .catch((error) => {
          console.error("Audio URL test failed:", error);
        });
    }
  }, [audioData, fullAudioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !fullAudioUrl) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = (e) => {
      console.error("Audio loading error:", e);
      setIsLoading(false);
      setError("Audio file cannot be played. You can still download it.");
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || audioData?.duration || 0);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [fullAudioUrl, audioData]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !fullAudioUrl) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Ensure audio is loaded before playing
        if (audio.readyState < 2) {
          setError("Audio is still loading. Please wait...");
          return;
        }

        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setError("Failed to play audio. Please try downloading the file.");
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = async () => {
    if (!fullAudioUrl) {
      setError("No audio file available for download");
      return;
    }

    try {
      const response = await fetch(fullAudioUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = audioData?.filename || `audio_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download audio file. Please try again.");
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-base sm:text-lg truncate">
              Generated Audio
            </span>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              <Languages className="h-3 w-3 flex-shrink-0" />
              <span className="hidden xs:inline">
                {audioData?.language === "en"
                  ? "English"
                  : audioData?.language === "ne"
                  ? "Nepali"
                  : "Unknown"}
              </span>
              <span className="xs:hidden">
                {audioData?.language?.toUpperCase() || "UN"}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              <Clock className="h-3 w-3 flex-shrink-0" />
              {audioData?.duration ? formatTime(audioData.duration) : "N/A"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-destructive leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              Loading audio...
            </p>
          </div>
        )}

        {fullAudioUrl && (
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error("Audio error:", e);
              setError(
                "Audio format not supported. Please try downloading the file."
              );
            }}
            onLoadedData={() => setError(null)}
            preload="metadata"
            crossOrigin="anonymous"
          >
            <source src={fullAudioUrl} type="audio/mpeg" />
            <source src={fullAudioUrl} type="audio/wav" />
            <source src={fullAudioUrl} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Audio Controls */}
        <div className="space-y-3 sm:space-y-0">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            {/* Progress Bar - Full Width on Mobile */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[35px]">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-3 bg-muted rounded-full cursor-pointer touch-manipulation relative"
                onClick={handleSeek}
                style={{ minHeight: "44px" }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-3 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap min-w-[35px] text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons - Full Width on Mobile */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={togglePlayPause}
                size="sm"
                className="flex items-center justify-center gap-2 h-10 touch-manipulation"
                disabled={!fullAudioUrl || isLoading}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Play</span>
                  </>
                )}
              </Button>

              <Button
                onClick={onDownload || handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2 h-10 touch-manipulation"
                disabled={!fullAudioUrl}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center gap-4">
            <Button
              onClick={togglePlayPause}
              size="sm"
              className="flex items-center justify-center gap-2 min-w-[80px]"
              disabled={!fullAudioUrl || isLoading}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </>
              )}
            </Button>

            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-2 bg-muted rounded-full cursor-pointer min-w-[100px]"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatTime(duration)}
              </span>
            </div>

            <Button
              onClick={onDownload || handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 min-w-[100px]"
              disabled={!fullAudioUrl}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        {/* Audio Info */}
        <div className="pt-4 border-t">
          {/* Mobile: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-xs sm:text-sm font-medium mb-1">Format</p>
              <p className="text-xs text-muted-foreground">MP3</p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-xs sm:text-sm font-medium mb-1">Quality</p>
              <p className="text-xs text-muted-foreground">128 kbps</p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-xs sm:text-sm font-medium mb-1">Size</p>
              <p className="text-xs text-muted-foreground">
                {audioData?.fileSize
                  ? `${(audioData.fileSize / 1024).toFixed(1)} KB`
                  : "N/A"}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-xs sm:text-sm font-medium mb-1">Voice</p>
              <p className="text-xs text-muted-foreground capitalize truncate">
                {audioData?.voice || "default"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
