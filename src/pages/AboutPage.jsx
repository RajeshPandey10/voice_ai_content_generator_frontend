import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Heart, Users, Target, CheckCircle, Star } from "lucide-react";

export function AboutPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Bot className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">
          About Voice AI Content Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering Nepali small and medium enterprises with AI-driven content
          creation that's optimized for voice search and local discoverability.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To democratize digital marketing for Nepali businesses by
              providing accessible, AI-powered content generation tools that
              help small and medium enterprises compete in the digital
              marketplace.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A future where every Nepali business, regardless of size or
              technical expertise, can create professional, voice-search
              optimized content that reaches their target audience effectively.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why Nepal Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            Why Focus on Nepal?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nepal's digital economy is rapidly growing, but many small
            businesses struggle with creating effective online content. Our
            platform addresses this gap by providing:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Content that understands Nepali business culture</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Local SEO optimization for Nepali markets</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Voice search optimization for mobile-first users</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Affordable pricing for small business budgets</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Makes Us Different
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Bot className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI models trained specifically for business content
                generation and voice search optimization.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle>Voice Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content structured for voice assistants and local search queries
                that your customers actually use.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle>User-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Simple interface designed for business owners with no technical
                background required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Built with ❤️ for Nepal</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team understands the unique challenges faced by Nepali
            businesses in the digital age. We're committed to providing tools
            that are not just technologically advanced, but also culturally
            relevant and practically useful.
          </p>
          <div className="flex justify-center items-center gap-1 mt-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              Trusted by 500+ Nepali businesses
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
