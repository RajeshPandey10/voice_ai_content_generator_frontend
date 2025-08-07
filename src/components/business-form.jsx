import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Briefcase, Package, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const businessTypesData = {
  en: [
    { value: "cafe", label: "Cafe" },
    { value: "restaurant", label: "Restaurant" },
    { value: "salon_beauty", label: "Salon & Beauty" },
    { value: "store_retail", label: "Store/Retail" },
    { value: "grocery_store", label: "Grocery Store" },
    { value: "electronics_store", label: "Electronics Store" },
    { value: "clothing_store", label: "Clothing Store" },
    { value: "medical_store", label: "Medical Store/Pharmacy" },
    { value: "hardware_store", label: "Hardware Store" },
    { value: "bookstore", label: "Bookstore" },
    { value: "consultancy", label: "Consultancy" },
    { value: "gym_fitness", label: "Gym & Fitness" },
    { value: "hotel", label: "Hotel" },
    { value: "tourism_travel", label: "Tourism & Travel" },
    { value: "education_training", label: "Education & Training" },
    { value: "photography", label: "Photography" },
    { value: "real_estate", label: "Real Estate" },
    { value: "it_software", label: "IT & Software" },
    { value: "digital_marketing", label: "Digital Marketing" },
    { value: "construction", label: "Construction" },
    { value: "automobile_service", label: "Automobile Service" },
    { value: "banking_finance", label: "Banking & Finance" },
    { value: "healthcare_clinic", label: "Healthcare/Clinic" },
    { value: "dental_clinic", label: "Dental Clinic" },
    { value: "law_firm", label: "Law Firm" },
    { value: "accounting", label: "Accounting" },
    { value: "insurance", label: "Insurance" },
    { value: "event_management", label: "Event Management" },
    { value: "catering_service", label: "Catering Service" },
    { value: "delivery_service", label: "Delivery Service" },
    { value: "transportation", label: "Transportation" },
    { value: "repair_service", label: "Repair Service" },
    { value: "home_service", label: "Home Service" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "agriculture", label: "Agriculture" },
    { value: "other", label: "Other" },
  ],
  ne: [
    { value: "cafe", label: "क्याफे" },
    { value: "restaurant", label: "रेस्टुरेन्ट" },
    { value: "salon_beauty", label: "सैलून र ब्यूटी" },
    { value: "store_retail", label: "पसल/रिटेल" },
    { value: "grocery_store", label: "किराना पसल" },
    { value: "electronics_store", label: "इलेक्ट्रोनिक्स पसल" },
    { value: "clothing_store", label: "कपडा पसल" },
    { value: "medical_store", label: "मेडिकल स्टोर/फार्मेसी" },
    { value: "hardware_store", label: "हार्डवेयर पसल" },
    { value: "bookstore", label: "पुस्तक पसल" },
    { value: "consultancy", label: "सल्लाहकार सेवा" },
    { value: "gym_fitness", label: "जिम र फिटनेस" },
    { value: "hotel", label: "होटल" },
    { value: "tourism_travel", label: "पर्यटन र यात्रा" },
    { value: "education_training", label: "शिक्षा र प्रशिक्षण" },
    { value: "photography", label: "फोटोग्राफी" },
    { value: "real_estate", label: "घरजग्गा" },
    { value: "it_software", label: "आईटी र सफ्टवेयर" },
    { value: "digital_marketing", label: "डिजिटल मार्केटिङ" },
    { value: "construction", label: "निर्माण" },
    { value: "automobile_service", label: "अटोमोबाइल सेवा" },
    { value: "banking_finance", label: "बैंकिङ र वित्त" },
    { value: "healthcare_clinic", label: "स्वास्थ्य सेवा/क्लिनिक" },
    { value: "dental_clinic", label: "दन्त चिकित्सालय" },
    { value: "law_firm", label: "कानुनी फर्म" },
    { value: "accounting", label: "लेखांकन" },
    { value: "insurance", label: "बीमा" },
    { value: "event_management", label: "कार्यक्रम व्यवस्थापन" },
    { value: "catering_service", label: "खाना पकाउने सेवा" },
    { value: "delivery_service", label: "डेलिभरी सेवा" },
    { value: "transportation", label: "यातायात" },
    { value: "repair_service", label: "मर्मत सेवा" },
    { value: "home_service", label: "घर सेवा" },
    { value: "manufacturing", label: "उत्पादन" },
    { value: "agriculture", label: "कृषि" },
    { value: "other", label: "अन्य" },
  ],
};

export function BusinessForm({ onSubmit, loading }) {
  const { t, currentLanguage } = useLanguage();
  const [form, setForm] = useState({
    business_name: "",
    location: "",
    business_type: "",
    custom_business_type: "",
    products_services: "",
    target_customers: "",
  });
  const [errors, setErrors] = useState({});

  const businessTypes =
    businessTypesData[currentLanguage] || businessTypesData.en;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.business_name.trim()) {
      newErrors.business_name = t("businessNameRequired");
    }

    if (!form.location.trim()) {
      newErrors.location = t("locationRequired");
    }

    if (!form.business_type) {
      newErrors.business_type = t("businessTypeRequired");
    }

    // If "Other" is selected, validate custom business type
    if (form.business_type === "other" && !form.custom_business_type.trim()) {
      newErrors.custom_business_type = t("pleaseSpecifyBusinessType");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = { ...form };
      // Use custom business type if "Other" is selected
      if (form.business_type === "other" && form.custom_business_type) {
        submitData.business_type = form.custom_business_type;
      }
      onSubmit(submitData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          {t("generateContent")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {t("fillBusinessDetails")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="business_name"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("businessName")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="business_name"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder={t("businessNamePlaceholder")}
              className={errors.business_name ? "border-red-500" : ""}
            />
            {errors.business_name && (
              <p className="text-sm text-red-500">{errors.business_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("location")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder={t("locationPlaceholder")}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t("businessType")} <span className="text-red-500">*</span>
            </Label>
            <Select
              id="business_type"
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className={errors.business_type ? "border-red-500" : ""}
            >
              <option value="">{t("selectBusinessType")}</option>
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.business_type && (
              <p className="text-sm text-red-500">{errors.business_type}</p>
            )}
          </div>

          {/* Custom Business Type Input - Show when "Other" is selected */}
          {form.business_type === "other" && (
            <div className="space-y-2">
              <Label
                htmlFor="custom_business_type"
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                {t("specifyBusinessType")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="custom_business_type"
                name="custom_business_type"
                value={form.custom_business_type}
                onChange={handleChange}
                placeholder={t("businessTypePlaceholder")}
                className={errors.custom_business_type ? "border-red-500" : ""}
              />
              {errors.custom_business_type && (
                <p className="text-sm text-red-500">
                  {errors.custom_business_type}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="products_services"
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              {t("productsServices")}
            </Label>
            <Textarea
              id="products_services"
              name="products_services"
              value={form.products_services}
              onChange={handleChange}
              placeholder={t("productsServicesPlaceholder")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="target_customers"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {t("targetCustomers")}
            </Label>
            <Input
              id="target_customers"
              name="target_customers"
              value={form.target_customers}
              onChange={handleChange}
              placeholder={t("targetCustomersPlaceholder")}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 sm:h-12 text-sm sm:text-lg btn-touch"
          >
            {loading ? t("generatingContent") : t("generateButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
