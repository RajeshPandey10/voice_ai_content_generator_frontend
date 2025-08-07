import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Crown,
  Zap,
  FileText,
  Volume2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function CreditDisplay() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Sign in to track your usage and credits
          </p>
        </CardContent>
      </Card>
    );
  }

  const subscription = user.subscription || {};
  const contentProgress =
    subscription.monthlyLimits?.content > 0
      ? ((subscription.usageCount?.content || 0) /
          subscription.monthlyLimits.content) *
        100
      : 0;
  const audioProgress =
    subscription.monthlyLimits?.audio > 0
      ? ((subscription.usageCount?.audio || 0) /
          subscription.monthlyLimits.audio) *
        100
      : 0;

  const isUnlimited = subscription.plan === "pro_plus";
  const isNearLimit = contentProgress > 80 || audioProgress > 80;

  return (
    <Card
      className={`${
        isNearLimit && !isUnlimited
          ? "border-orange-200 bg-orange-50 dark:bg-orange-950"
          : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown
              className={`h-5 w-5 ${
                subscription.plan === "free"
                  ? "text-gray-500"
                  : subscription.plan === "pro"
                  ? "text-blue-500"
                  : "text-purple-500"
              }`}
            />
            {subscription.plan === "free" && "Free Plan"}
            {subscription.plan === "pro" && "Pro Plan"}
            {subscription.plan === "pro_plus" && "Pro Plus Plan"}
          </CardTitle>
          <Badge
            variant={subscription.plan === "free" ? "secondary" : "default"}
          >
            {subscription.status || "Active"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Generation Credits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Content Generation</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {isUnlimited
                ? "Unlimited"
                : `${subscription.usageCount?.content || 0}/${
                    subscription.monthlyLimits?.content || 0
                  }`}
            </span>
          </div>
          {!isUnlimited && <Progress value={contentProgress} className="h-2" />}
        </div>

        {/* Audio Generation Credits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Audio Generation</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {isUnlimited
                ? "Unlimited"
                : `${subscription.usageCount?.audio || 0}/${
                    subscription.monthlyLimits?.audio || 0
                  }`}
            </span>
          </div>
          {!isUnlimited && <Progress value={audioProgress} className="h-2" />}
        </div>

        {/* Reset Date */}
        {subscription.resetDate && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Credits reset on{" "}
              {new Date(subscription.resetDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Upgrade CTA */}
        {subscription.plan === "free" && (
          <div className="pt-2 border-t">
            <Link to="/pricing">
              <Button size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}

        {/* Low Credits Warning */}
        {isNearLimit && !isUnlimited && (
          <div className="pt-2 border-t bg-orange-50 dark:bg-orange-950 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Running low on credits
              </span>
            </div>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
              Consider upgrading to continue generating content
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
