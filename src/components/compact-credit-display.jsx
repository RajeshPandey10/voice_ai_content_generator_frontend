import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Crown,
  FileText,
  Volume2,
  AlertTriangle,
  TrendingUp,
  Code,
  Infinity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isDeveloper } from "@/utils/developer";

export function CompactCreditDisplay() {
  const { user } = useAuth();

  if (!user) return null;

  const subscription = user.subscription || {};
  const contentUsage = subscription.usageCount?.content || 0;
  const audioUsage = subscription.usageCount?.audio || 0;
  const contentLimit = subscription.monthlyLimits?.content || 0;
  const audioLimit = subscription.monthlyLimits?.audio || 0;

  const isUnlimited = subscription.plan === "pro_plus" || isDeveloper(user);
  const contentProgress =
    contentLimit > 0 ? (contentUsage / contentLimit) * 100 : 0;
  const audioProgress = audioLimit > 0 ? (audioUsage / audioLimit) * 100 : 0;
  const isNearLimit =
    (contentProgress > 80 || audioProgress > 80) && !isUnlimited;

  const getPlanIcon = () => {
    if (isDeveloper(user)) {
      return <Code className="h-4 w-4 text-orange-500" />;
    }
    switch (subscription.plan) {
      case "pro":
        return <Crown className="h-4 w-4 text-blue-500" />;
      case "pro_plus":
        return <Crown className="h-4 w-4 text-purple-500" />;
      default:
        return <Crown className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Plan Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={
                isDeveloper(user)
                  ? "default"
                  : subscription.plan === "free"
                  ? "secondary"
                  : "default"
              }
              className={`flex items-center gap-1 cursor-help ${
                isDeveloper(user)
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
                  : ""
              }`}
            >
              {getPlanIcon()}
              <span className="hidden sm:inline">
                {isDeveloper(user) && "DEV"}
                {!isDeveloper(user) && subscription.plan === "free" && "Free"}
                {!isDeveloper(user) && subscription.plan === "pro" && "Pro"}
                {!isDeveloper(user) &&
                  subscription.plan === "pro_plus" &&
                  "Pro+"}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              <p className="font-medium">
                {isDeveloper(user) && "Developer Edition"}
                {!isDeveloper(user) &&
                  subscription.plan === "free" &&
                  "Free Plan"}
                {!isDeveloper(user) &&
                  subscription.plan === "pro" &&
                  "Pro Plan"}
                {!isDeveloper(user) &&
                  subscription.plan === "pro_plus" &&
                  "Pro Plus Plan"}
              </p>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <span>
                    Content:{" "}
                    {isUnlimited ? (
                      isDeveloper(user) ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="h-3 w-3" /> Developer Access
                        </span>
                      ) : (
                        "Unlimited"
                      )
                    ) : (
                      `${contentUsage}/${contentLimit}`
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3 w-3" />
                  <span>
                    Audio:{" "}
                    {isUnlimited ? (
                      isDeveloper(user) ? (
                        <span className="flex items-center gap-1">
                          <Infinity className="h-3 w-3" /> Developer Access
                        </span>
                      ) : (
                        "Unlimited"
                      )
                    ) : (
                      `${audioUsage}/${audioLimit}`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Warning for low credits */}
        {isNearLimit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-orange-500 hover:text-orange-600"
                asChild
              >
                <Link to="/pricing">
                  <AlertTriangle className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-orange-600 dark:text-orange-400">
                Running low on credits. Click to upgrade!
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Upgrade button for free users (not for developers) */}
        {subscription.plan === "free" && !isNearLimit && !isDeveloper(user) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
                asChild
              >
                <Link to="/pricing">
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade to Pro for more credits</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
