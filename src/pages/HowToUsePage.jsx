import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  FileText,
  Settings,
  Download,
  Copy,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function HowToUsePage() {
  const steps = [
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Choose Content Type",
      description: "Select what type of content you want to generate",
      details: [
        "Business Description - Professional overview of your business",
        "FAQ Generation - Common questions customers ask",
        "Service Description - Detailed service offerings",
        "Product Description - Compelling product descriptions",
      ],
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Fill Business Details",
      description: "Provide your business information for personalized content",
      details: [
        "Business name and industry",
        "Target audience and location",
        "Key services or products",
        "Unique selling points",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Generate Content",
      description: "Our AI creates optimized content for your business",
      details: [
        "AI analyzes your business details",
        "Generates voice-search optimized content",
        "Includes local SEO elements",
        "Ready in under 30 seconds",
      ],
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Copy & Use",
      description: "Download or copy the generated content",
      details: [
        "Copy to clipboard with one click",
        "Download as text or PDF",
        "Edit and customize as needed",
        "Use across all your marketing channels",
      ],
    },
  ];

  const contentTypes = [
    {
      type: "Business Description",
      description:
        "Professional business overviews that explain who you are, what you do, and why customers should choose you.",
      example:
        "Perfect for Google My Business, website about pages, and social media profiles.",
    },
    {
      type: "FAQ Generation",
      description:
        "Common questions and answers that customers typically ask about your business or services.",
      example:
        "Great for website FAQ sections, customer support, and voice search optimization.",
    },
    {
      type: "Service Description",
      description:
        "Detailed descriptions of your services that highlight benefits and convince customers to take action.",
      example: "Ideal for service pages, brochures, and marketing materials.",
    },
    {
      type: "Product Description",
      description:
        "Compelling product descriptions that showcase features, benefits, and drive sales.",
      example:
        "Perfect for e-commerce sites, catalogs, and online marketplaces.",
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <PlayCircle className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">
          How to Use Voice AI Content Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Generate professional, voice-search optimized content for your Nepali
          business in just 4 simple steps.
        </p>
      </div>

      {/* Steps Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Simple 4-Step Process
        </h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-400">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">Step {index + 1}</Badge>
                      {step.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-muted-foreground absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:block" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="ml-16">
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Types Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Available Content Types
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {contentTypes.map((content, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{content.type}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{content.description}</p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium">Use Case:</p>
                  <p className="text-sm text-muted-foreground">
                    {content.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>💡 Pro Tips for Better Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Input Tips:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific about your business location in Nepal</li>
                <li>• Mention your target customer age group</li>
                <li>• Include unique selling points</li>
                <li>• Specify your main services or products</li>
                <li>• Use clear, simple language</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Content Optimization:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Content is optimized for Nepali search patterns</li>
                <li>• Includes voice search friendly phrases</li>
                <li>• Uses local business terminology</li>
                <li>• Structured for featured snippets</li>
                <li>• Mobile-friendly formatting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <CardContent className="py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">
            Create your first AI-generated content in less than 2 minutes!
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Copy className="h-4 w-4 mr-1" />
              Easy Copy & Paste
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Download className="h-4 w-4 mr-1" />
              Multiple Formats
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              Instant Results
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
