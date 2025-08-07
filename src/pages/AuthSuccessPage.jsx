import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function AuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthSuccess, isAuthenticated } = useAuth();

  useEffect(() => {
    const processOAuthTokens = async () => {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh");

        if (!token || !refreshToken) {
          toast.error("Authentication Failed", {
            description: "Missing authentication tokens. Please try again.",
          });
          navigate("/auth");
          return;
        }

        // Call the OAuth success handler
        const result = await handleOAuthSuccess(token, refreshToken);

        if (result.success) {
          toast.success("Welcome!", {
            description: "Successfully signed in to your account.",
            duration: 3000,
          });

          // Redirect to home page after successful authentication
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error("Authentication Failed", {
            description:
              result.error || "Failed to authenticate. Please try again.",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("OAuth processing error:", error);
        toast.error("Authentication Error", {
          description: "An unexpected error occurred. Please try again.",
        });
        navigate("/auth");
      }
    };

    processOAuthTokens();
  }, [searchParams, navigate, handleOAuthSuccess]);

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Completing Sign In...</h1>
          <p className="text-muted-foreground">
            Please wait while we set up your account.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Processing authentication tokens...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
