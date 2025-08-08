import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Check,
  Star,
  Zap,
  Users,
  Crown,
  Rocket,
  Shield,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function PricingPage() {
  const [loading, setLoading] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = async (planName, price) => {
    if (!isAuthenticated) {
      toast.error("Sign In Required", {
        description: "Please sign in to select a plan.",
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    if (price === "₹0") {
      toast.success("You're already on the Free plan!", {
        description: "Start generating content right away.",
      });
      navigate("/");
      return;
    }

    setLoading(planName);

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`${planName} Plan Selected!`, {
        description: "Your subscription has been activated.",
      });

      // In a real app, you would call your payment API here
      console.log(`Selected plan: ${planName} for ${price}`);
    } catch (error) {
      toast.error("Payment Failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setLoading(null);
    }
  };
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out our service",
      icon: <Zap className="h-6 w-6" />,
      popular: false,
      features: [
        "5 content generations per month",
        "Basic business descriptions",
        "Standard voice optimization",
        "Copy to clipboard",
        "Email support",
      ],
      limitations: [
        "Limited to 5 generations",
        "No download options",
        "No history tracking",
        "Standard processing speed",
      ],
    },
    {
      name: "Starter",
      price: "₹499",
      period: "per month",
      description: "Great for small businesses getting started",
      icon: <Users className="h-6 w-6" />,
      popular: true,
      features: [
        "50 content generations per month",
        "All content types (descriptions, FAQs, etc.)",
        "Advanced voice search optimization",
        "Download as PDF/TXT",
        "Content history & management",
        "Priority email support",
        "SEO keyword suggestions",
      ],
      limitations: [],
    },
    {
      name: "Professional",
      price: "₹999",
      period: "per month",
      description: "For growing businesses with regular content needs",
      icon: <Crown className="h-6 w-6" />,
      popular: false,
      features: [
        "200 content generations per month",
        "All Starter features",
        "Custom content templates",
        "Bulk content generation",
        "Advanced analytics",
        "API access (coming soon)",
        "Phone & email support",
        "Custom branding options",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large businesses and agencies",
      icon: <Rocket className="h-6 w-6" />,
      popular: false,
      features: [
        "Unlimited content generations",
        "All Professional features",
        "White-label solution",
        "Dedicated account manager",
        "Custom AI model training",
        "24/7 priority support",
        "Custom integrations",
        "SLA guarantee",
      ],
      limitations: [],
    },
  ];

  const faqs = [
    {
      question: "How does the free plan work?",
      answer:
        "You get 5 free content generations every month. No credit card required, no hidden fees. Perfect for testing our service before upgrading.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! All our paid plans are month-to-month with no long-term commitments. You can cancel anytime from your account settings.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and popular digital wallets including eSewa, Khalti, and bank transfers for Nepali customers.",
    },
    {
      question: "Is there a discount for annual payments?",
      answer:
        "Yes! Save 20% when you pay annually. Contact us for custom enterprise pricing and volume discounts.",
    },
    {
      question: "What if I exceed my monthly limit?",
      answer:
        "You can either upgrade your plan or purchase additional generations at ₹20 per generation. We'll notify you before you reach your limit.",
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 shadow-lg">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto transition-colors duration-300">
            Transparent pricing designed for Nepali businesses. Start free,
            upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:shadow-xl border ${
                plan.popular
                  ? "border-purple-500 shadow-lg scale-105 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-400"
                  : "border-border bg-card hover:bg-accent hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg border-0">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-4 transition-colors duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-800/40 dark:to-blue-800/40 text-purple-600 dark:text-purple-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl mb-2 text-card-foreground transition-colors duration-300">
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold text-card-foreground transition-colors duration-300">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 transition-colors duration-300">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 pt-0">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-card-foreground transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-sm font-medium text-muted-foreground transition-colors duration-300">
                      Limitations:
                    </p>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start gap-3">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/30 mt-0.5 flex-shrink-0 transition-colors duration-300" />
                        <span className="text-sm text-muted-foreground transition-colors duration-300">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg"
                      : "border-border text-card-foreground hover:bg-accent hover:border-purple-400"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.name, plan.price)}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.price === "Custom"
                        ? "Contact Sales"
                        : plan.price === "₹0"
                        ? "Get Started Free"
                        : "Start Trial"}
                      {plan.price !== "Custom" && plan.price !== "₹0" && (
                        <ArrowRight className="h-4 w-4 ml-2" />
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="mb-12 bg-card shadow-lg border border-border transition-colors duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-card-foreground transition-colors duration-300">
              Why Choose Our Pricing?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-800/30 rounded-2xl mx-auto mb-4 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="font-semibold mb-3 text-card-foreground transition-colors duration-300">
                  No Hidden Fees
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  What you see is what you pay. No surprise charges or hidden
                  costs.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-2xl mx-auto mb-4 transition-colors duration-300">
                  <Clock className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="font-semibold mb-3 text-card-foreground transition-colors duration-300">
                  Fair Usage
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Generous limits that actually work for real businesses.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-800/30 rounded-2xl mx-auto mb-4 transition-colors duration-300">
                  <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h3 className="font-semibold mb-3 text-card-foreground transition-colors duration-300">
                  Value for Money
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Premium AI content generation at prices Nepali businesses can
                  afford.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="bg-card border border-border transition-colors duration-300 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground transition-colors duration-300">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground transition-colors duration-300">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 mt-12 shadow-xl">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-purple-100 mb-6">
              Our team is here to help you choose the right plan for your
              business.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                variant="outline"
                className="bg-white text-purple-600 border-white hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
                onClick={() => {
                  toast.info("Contact Sales", {
                    description:
                      "Please email us at sales@example.com or call +977-123-456-789",
                  });
                }}
              >
                Contact Sales
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white border-0 transition-all duration-300 shadow-lg"
                onClick={() => navigate("/")}
              >
                Start Free Trial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
