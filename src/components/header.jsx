import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/theme-context";
import {
  Bot,
  Menu,
  X,
  User,
  History,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  CreditCard,
  Crown,
  Code,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CompactCreditDisplay } from "./compact-credit-display";
import { LanguageSelector } from "./language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import { isDeveloper, getDeveloperInfo } from "@/utils/developer";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("howToUse"), href: "/how-to-use" },
    { name: t("pricing"), href: "/pricing" },
  ];

  const isActive = (href) => location.pathname === href;

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pro_plus":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getDeveloperBadge = () => {
    if (!isDeveloper(user)) return null;

    return (
      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
        <Code className="h-3 w-3 mr-1" />
        DEV
      </Badge>
    );
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Don't close mobile menu when toggling theme
  };

  return (
    <header className="sticky top-0 z-40 w-full header-solid shadow-sm">
      <div className="container flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 mx-auto relative">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0"
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-600 p-0.5">
            <img
              src="/logo_voice_ai.png"
              alt="Voice AI Generator Logo"
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
          <div className="min-w-0 hidden xs:block">
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
              {t("voiceScriptsGenerator") || "Voice AI Content Generator"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
              {t("forNepaliSMEs")}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Credit Display for authenticated users */}
          {user && (
            <div className="hidden xs:block">
              <CompactCreditDisplay />
            </div>
          )}

          {/* Language Selector */}
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="md"
            onClick={toggleTheme}
            className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
            title={`Current theme: ${theme} - Click to switch`}
          >
            {effectiveTheme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          {/* User Menu or Sign In */}
          {user ? (
            <div className="relative">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3 hover:bg-accent/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate max-w-24">
                          {user.name || user.email}
                        </span>
                        {getDeveloperBadge()}
                      </div>
                      {user.subscription?.plan && !isDeveloper(user) && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPlanBadgeColor(
                            user.subscription.plan
                          )}`}
                        >
                          {user.subscription.plan
                            .replace("_", " ")
                            .toUpperCase()}
                        </Badge>
                      )}
                      {isDeveloper(user) && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800 dark:from-purple-900 dark:to-orange-900 dark:text-purple-300"
                        >
                          UNLIMITED ACCESS
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 bg-background/98 backdrop-blur-lg border border-border/80 shadow-2xl z-[100] rounded-lg p-1"
                  style={{ zIndex: 100 }}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/history"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <History className="h-4 w-4" />
                      {t("contentHistory")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/pricing"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      {t("subscription")}
                      {user.subscription?.plan === "free" && (
                        <Badge variant="outline" className="ml-auto">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {t("upgrade")}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">{t("signIn")}</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="md"
                className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={`w-[280px] sm:w-[300px] p-4 sm:p-6 ${
                effectiveTheme === "dark"
                  ? "bg-[hsl(222.2_84%_4.9%)] text-[hsl(210_40%_98%)] border-[hsl(217.2_32.6%_17.5%)]"
                  : "bg-white text-[hsl(222.2_84%_4.9%)] border-[hsl(214.3_31.8%_91.4%)]"
              }`}
            >
              <nav className="flex flex-col gap-4 mt-6 sm:mt-8">
                {/* Mobile-only controls */}
                <div className="pb-4 border-b space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("language")}
                    </span>
                    <LanguageSelector variant="outline" size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("theme")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleThemeToggle}
                      className="h-9 w-16 flex-shrink-0 text-xs"
                      title={`Current theme: ${theme} - Click to switch`}
                    >
                      {effectiveTheme === "dark" ? (
                        <>
                          <Sun className="h-4 w-4 mr-1" />
                          Light
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-1" />
                          Dark
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* User info in mobile */}
                {user && (
                  <div className="pb-4 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {user.name || user.email}
                          </p>
                          {getDeveloperBadge()}
                        </div>
                        {user.subscription?.plan && !isDeveloper(user) && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPlanBadgeColor(
                              user.subscription.plan
                            )}`}
                          >
                            {user.subscription.plan
                              .replace("_", " ")
                              .toUpperCase()}
                          </Badge>
                        )}
                        {isDeveloper(user) && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800 dark:from-purple-900 dark:to-orange-900 dark:text-purple-300"
                          >
                            UNLIMITED ACCESS
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CompactCreditDisplay />
                  </div>
                )}

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {user && (
                  <>
                    <hr className="my-2" />
                    <Link
                      to="/history"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                    >
                      <History className="h-5 w-5" />
                      {t("contentHistory")}
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      {t("subscription")}
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {t("signOut")}
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
