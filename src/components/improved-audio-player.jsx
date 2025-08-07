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
  Loader2,
} from "lucide-react";

export function ImprovedAudioPlayer({ audioData, language = "English" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef(null);

  // Construct the audio URL properly
  const audioUrl = audioData?.audioFile || audioData?.url;
  const fullAudioUrl = audioUrl
    ? audioUrl.startsWith("http")
      ? audioUrl
      : `http://localhost:3000${audioUrl}`
    : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !fullAudioUrl) return;

    setIsLoading(true);
    setError(null);

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      } else if (audioData?.duration) {
        setDuration(audioData.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.error("Audio loading error:", e);
      setIsLoading(false);
      setError("Unable to load audio. Try downloading instead.");
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Cleanup
    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [fullAudioUrl, audioData]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
      setError("Playback failed. Try refreshing the page.");
    }
  };

  const handleDownload = async () => {
    if (!fullAudioUrl) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Create a new XMLHttpRequest for tracking download progress
      const xhr = new XMLHttpRequest();

      xhr.open("GET", fullAudioUrl, true);
      xhr.responseType = "blob";

      xhr.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setDownloadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `content-audio-${Date.now()}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error(`Download failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error("Download failed due to network error");
      };

      xhr.send();
    } catch (error) {
      console.error("Download error:", error);
      setError("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getQuality = () => {
    if (audioData?.quality) return audioData.quality;
    return "128 kbps"; // Default
  };

  if (!audioData || !fullAudioUrl) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>No audio available</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Volume2 className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Generated Audio</span>
          </CardTitle>
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-xs w-fit"
          >
            <Languages className="h-3 w-3 flex-shrink-0" />
            <span className="hidden xs:inline">{language}</span>
            <span className="xs:hidden">
              {language.substring(0, 2).toUpperCase()}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-red-700 dark:text-red-300 leading-relaxed">
              {error}
            </span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              Loading audio...
            </span>
          </div>
        )}

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={fullAudioUrl}
          preload="metadata"
          className="hidden"
        />

        {/* Player Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={togglePlayPause}
              disabled={isLoading || error}
              size="sm"
              className="h-10 w-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Progress
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                className="h-2"
              />
            </div>
          </div>

          {/* Download Section */}
          <div className="flex items-center gap-3 pt-3 border-t">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isDownloading ? "Downloading..." : "Download"}
            </Button>

            <div className="text-right text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <FileAudio className="h-3 w-3" />
                MP3
              </div>
              <div>{getQuality()}</div>
              {audioData?.fileSize && (
                <div>{formatFileSize(audioData.fileSize)}</div>
              )}
            </div>
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Downloading...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
