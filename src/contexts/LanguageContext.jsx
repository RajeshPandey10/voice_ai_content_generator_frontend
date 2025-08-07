import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Language translations
const translations = {
  en: {
    // Header
    voiceScriptsGenerator: "Voice AI Content Generator",
    home: "Home",
    about: "About",
    howToUse: "How to Use",
    pricing: "Pricing",
    signIn: "Sign In",
    signOut: "Sign Out",
    contentHistory: "Content History",
    subscription: "Subscription",
    upgrade: "Upgrade",
    forNepaliSMEs: "For Nepali SMEs",
    language: "Language",
    theme: "Theme",

    // Content Generation
    generateVoiceOptimized:
      "Generate voice search optimized business descriptions and FAQs tailored for Nepali small and medium enterprises",
    generateContent: "Generate Your Content",
    fillBusinessDetails:
      "Fill in your business details below to generate AI-powered content",
    businessName: "Business Name",
    location: "Location (City/Town)",
    businessType: "Business Type",
    productsServices: "Products/Services",
    targetCustomers: "Target Customers",
    generateButton: "Generate Content",
    generating: "Generating...",

    // Placeholders
    businessNamePlaceholder: "e.g., Kathmandu Cafe",
    locationPlaceholder: "e.g., Thamel, Kathmandu",
    businessTypePlaceholder: "e.g., Restaurant, Store, Service",
    productsServicesPlaceholder: "e.g., Nepali cuisine, Coffee, Local dishes",
    targetCustomersPlaceholder: "e.g., Tourists, Locals, Young professionals",

    // Form Labels
    selectBusinessType: "Select business type",
    specifyBusinessType: "Specify Your Business Type",
    productsServicesOffered: "Products / Services Offered",

    // Error Messages
    businessNameRequired: "Business name is required",
    locationRequired: "Location is required",
    businessTypeRequired: "Business type is required",
    pleaseSpecifyBusinessType: "Please specify your business type",

    // Features
    lightningFast: "Lightning Fast",
    lightningFastDesc:
      "Generate professional content in seconds using advanced AI",
    voiceOptimized: "Voice Optimized",
    voiceOptimizedDesc: "Content optimized for voice search and local SEO",
    nepalFocused: "Nepal Focused",
    nepalFocusedDesc: "Specifically designed for Nepali businesses and market",

    // Quick Actions
    viewMyContent: "View My Content",
    upgradePlan: "Upgrade Plan",

    // Why Choose Section
    whyChooseTitle: "Why Choose Our AI Content Generator?",
    premiumQuality: "Premium Quality",
    premiumQualityDesc:
      "Professional-grade content powered by advanced AI models",
    instantResults: "Instant Results",
    instantResultsDesc: "Get your content generated in under 15 seconds",
    localizedContent: "Localized Content",
    localizedContentDesc:
      "Tailored specifically for the Nepali business market",

    // Results
    contentGenerated: "Content Generated Successfully!",
    downloadContent: "Download Content",
    generateAudio: "Generate Audio",
    playAudio: "Play Audio",
    pauseAudio: "Pause Audio",

    // Content Generation Page
    backToHome: "Back to Home",
    contentGeneratedSuccessfully: "Content Generated Successfully",
    contentReadyMessage: "Your AI-generated content for",
    contentReadyMessageEnd:
      "is ready. You can now generate audio or continue to make modifications.",
    continueToEditManage: "Continue to Edit & Manage",
    viewAllContent: "View All Content",

    // More content page translations
    welcomeMessage: "Welcome to Voice-Optimized AI Content Generator",
    welcomeSubtitle:
      "Generate premium, voice-search optimized content for your Nepali business in seconds",
    businessNamePlaceholder: "Enter your business name",
    locationPlaceholder: "City, Nepal (e.g., Kathmandu)",
    businessTypePlaceholder: "e.g., Restaurant, Shop, Service",
    productsServicesPlaceholder: "Describe what you offer",
    targetCustomersPlaceholder: "Who are your ideal customers?",
    generatingContent: "Generating Content...",

    // Audio
    generatingAudio: "Generating Audio...",
    downloadAudio: "Download Audio",
    audioGenerated: "Audio Generated Successfully",
    audioError: "Audio generation failed",

    // Credits
    credits: "Credits",
    creditsRemaining: "Credits Remaining",

    // Common
    loading: "Loading...",
    error: "Error",
    tryAgain: "Try Again",
    success: "Success",
    failed: "Failed",
    retry: "Retry",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",

    // Languages
    english: "English",
    nepali: "नेपाली",
    language: "Language",
  },

  ne: {
    // Header
    voiceScriptsGenerator: "भ्वाइस एआई सामग्री जेनेरेटर",
    home: "गृहपृष्ठ",
    about: "हाम्रो बारेमा",
    howToUse: "कसरी प्रयोग गर्ने",
    pricing: "मूल्य निर्धारण",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    contentHistory: "सामग्री इतिहास",
    subscription: "सदस्यता",
    upgrade: "अपग्रेड",
    forNepaliSMEs: "नेपाली साना तथा मझौला उद्यमका लागि",
    language: "भाषा",
    theme: "थिम",

    // Content Generation
    generateVoiceOptimized:
      "नेपाली साना तथा मझौला उद्यमहरूका लागि अनुकूलित भ्वाइस खोज अनुकूलित व्यवसायिक विवरण र बारम्बार सोधिने प्रश्नहरू उत्पन्न गर्नुहोस्",
    generateContent: "तपाईंको सामग्री उत्पन्न गर्नुहोस्",
    fillBusinessDetails:
      "AI-संचालित सामग्री उत्पन्न गर्न तल तपाईंको व्यवसायिक विवरणहरू भर्नुहोस्",
    businessName: "व्यवसायको नाम",
    location: "स्थान (शहर/नगर)",
    businessType: "व्यवसायको प्रकार",
    productsServices: "उत्पादन/सेवाहरू",
    targetCustomers: "लक्षित ग्राहकहरू",
    generateButton: "सामग्री उत्पन्न गर्नुहोस्",
    generating: "उत्पन्न गर्दै...",

    // Placeholders
    businessNamePlaceholder: "जस्तै, काठमाडौं क्याफे",
    locationPlaceholder: "जस्तै, थमेल, काठमाडौं",
    businessTypePlaceholder: "जस्तै, रेस्टुरेन्ट, पसल, सेवा",
    productsServicesPlaceholder: "जस्तै, नेपाली खाना, कफी, स्थानीय परिकार",
    targetCustomersPlaceholder: "जस्तै, पर्यटक, स्थानीय, युवा पेशेवर",

    // Form Labels
    selectBusinessType: "व्यवसायको प्रकार छान्नुहोस्",
    specifyBusinessType: "आफ्नो व्यवसायको प्रकार निर्दिष्ट गर्नुहोस्",
    productsServicesOffered: "उत्पादन / सेवाहरू प्रदान गरिएको",

    // Error Messages
    businessNameRequired: "व्यवसायको नाम आवश्यक छ",
    locationRequired: "स्थान आवश्यक छ",
    businessTypeRequired: "व्यवसायको प्रकार आवश्यक छ",
    pleaseSpecifyBusinessType:
      "कृपया आफ्नो व्यवसायको प्रकार निर्दिष्ट गर्नुहोस्",

    // Features
    lightningFast: "बिजुली जस्तै छिटो",
    lightningFastDesc:
      "उन्नत AI प्रयोग गरेर सेकेन्डमा व्यावसायिक सामग्री उत्पादन गर्नुहोस्",
    voiceOptimized: "आवाज अनुकूलित",
    voiceOptimizedDesc: "आवाज खोज र स्थानीय SEO का लागि अनुकूलित सामग्री",
    nepalFocused: "नेपाल केन्द्रित",
    nepalFocusedDesc: "नेपाली व्यवसाय र बजारका लागि विशेष रूपमा डिजाइन गरिएको",

    // Quick Actions
    viewMyContent: "मेरो सामग्री हेर्नुहोस्",
    upgradePlan: "योजना अपग्रेड गर्नुहोस्",

    // Why Choose Section
    whyChooseTitle: "हाम्रो AI सामग्री जेनेरेटर किन छान्ने?",
    premiumQuality: "प्रिमियम गुणस्तर",
    premiumQualityDesc:
      "उन्नत AI मोडेलहरूद्वारा संचालित व्यावसायिक-स्तरको सामग्री",
    instantResults: "तुरुन्त परिणाम",
    instantResultsDesc:
      "१५ सेकेन्ड भन्दा कममा आफ्नो सामग्री उत्पादन गराउनुहोस्",
    localizedContent: "स्थानीयकृत सामग्री",
    localizedContentDesc:
      "नेपाली व्यावसायिक बजारका लागि विशेष रूपमा तैयार पारिएको",

    // Results
    contentGenerated: "सामग्री सफलतापूर्वक उत्पन्न भयो!",
    downloadContent: "सामग्री डाउनलोड गर्नुहोस्",
    generateAudio: "अडियो उत्पन्न गर्नुहोस्",
    playAudio: "अडियो बजाउनुहोस्",
    pauseAudio: "अडियो रोक्नुहोस्",

    // Content Generation Page
    backToHome: "होममा फर्कनुहोस्",
    contentGeneratedSuccessfully: "सामग्री सफलतापूर्वक उत्पादन भयो",
    contentReadyMessage: "तपाईंको AI-उत्पादित सामग्री",
    contentReadyMessageEnd:
      "को लागि तयार छ। तपाईं अब अडियो उत्पादन गर्न वा परिमार्जन जारी राख्न सक्नुहुन्छ।",
    continueToEditManage: "सम्पादन र व्यवस्थापनमा जानुहोस्",
    viewAllContent: "सबै सामग्री हेर्नुहोस्",

    // More content page translations
    welcomeMessage: "आवाज-अनुकूलित AI सामग्री जेनेरेटरमा स्वागत छ",
    welcomeSubtitle:
      "सेकेन्डमा आफ्नो नेपाली व्यवसायका लागि प्रिमियम, आवाज-खोज अनुकूलित सामग्री उत्पादन गर्नुहोस्",
    businessNamePlaceholder: "आफ्नो व्यवसायको नाम लेख्नुहोस्",
    locationPlaceholder: "शहर, नेपाल (जस्तै, काठमाडौं)",
    businessTypePlaceholder: "जस्तै, रेस्टुरेन्ट, पसल, सेवा",
    productsServicesPlaceholder: "तपाईंले के प्रदान गर्नुहुन्छ वर्णन गर्नुहोस्",
    targetCustomersPlaceholder: "तपाईंका आदर्श ग्राहकहरू को हुन्?",
    generatingContent: "सामग्री उत्पादन गर्दै...",

    // Audio
    generatingAudio: "अडियो उत्पादन गर्दै...",
    downloadAudio: "अडियो डाउनलोड गर्नुहोस्",
    audioGenerated: "अडियो सफलतापूर्वक उत्पादन भयो",
    audioError: "अडियो उत्पादन असफल भयो",

    // Credits
    credits: "क्रेडिटहरू",
    creditsRemaining: "बाँकी क्रेडिटहरू",

    // Common
    loading: "लोड हुँदै...",
    error: "त्रुटि",
    tryAgain: "फेरि प्रयास गर्नुहोस्",
    success: "सफल",
    failed: "असफल",
    retry: "पुनः प्रयास गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    save: "सुरक्षित गर्नुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    delete: "मेटाउनुहोस्",

    // Languages
    english: "English",
    nepali: "नेपाली",
    language: "भाषा",
  },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem("language");
    return stored || "en";
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem("language", currentLanguage);
  }, [currentLanguage]);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && ["en", "ne"].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem("preferredLanguage", currentLanguage);
  }, [currentLanguage]);

  const switchLanguage = (languageCode) => {
    if (["en", "ne"].includes(languageCode)) {
      setCurrentLanguage(languageCode);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const isNepali = currentLanguage === "ne";
  const isEnglish = currentLanguage === "en";

  const value = {
    currentLanguage,
    switchLanguage,
    t, // translation function
    isNepali,
    isEnglish,
    availableLanguages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    ],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
