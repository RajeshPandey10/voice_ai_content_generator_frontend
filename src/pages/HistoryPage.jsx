import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  History,
  Search,
  Download,
  Copy,
  Filter,
  Calendar,
  FileText,
  Trash2,
  Eye,
} from "lucide-react";

export function HistoryPage() {
  const [contentHistory, setContentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/history");
      setContentHistory(response.data.history || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleDownload = (content, businessName, type) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName || "content"}-${type}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/${id}`);
      setContentHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const filteredHistory = contentHistory.filter((item) => {
    const matchesSearch =
      (item.generatedContent?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (item.businessDetails?.businessName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesFilter =
      filterType === "all" || item.businessDetails?.businessType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in to view your content history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Content History</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage all your generated content
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search content or business name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="text-xs sm:text-sm"
              >
                All
              </Button>
              <Button
                variant={
                  filterType === "business_description" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setFilterType("business_description")}
                className="text-xs sm:text-sm"
              >
                Descriptions
              </Button>
              <Button
                variant={filterType === "faq" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("faq")}
                className="text-xs sm:text-sm"
              >
                FAQs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
                <div className="h-20 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "No content matches your search criteria."
                : "You haven't generated any content yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredHistory.map((item) => (
            <Card key={item._id}>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {item.businessDetails?.businessName ||
                        "Generated Content"}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.businessDetails?.businessType?.replace(
                          "_",
                          " "
                        ) || "Content"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs sm:text-sm"
                    >
                      <Link to={`/content/${item._id}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">View Details</span>
                        <span className="xs:hidden">View</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.generatedContent)}
                      title="Copy content"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          item.generatedContent,
                          item.businessDetails?.businessName,
                          item.businessDetails?.businessType
                        )
                      }
                      title="Download content"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete content"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={`/content/${item._id}`}>
                  <div className="bg-muted p-3 sm:p-4 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap line-clamp-4 sm:line-clamp-6">
                      {item.generatedContent}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Click to view details and generate audio
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
