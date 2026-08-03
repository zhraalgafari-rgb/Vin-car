import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    vins: "VINs",
    parts: "Parts Library",
    suppliers: "Suppliers",
    customers: "Customers",
    orders: "Orders",
    documents: "Documents",
    search: "Search",
    settings: "Settings",
    new: "New",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    noResults: "No results found",
    searchPlaceholder: "Search VINs, parts, suppliers...",
  },
  ar: {
    dashboard: "لوحة التحكم",
    vins: "أرقام VIN",
    parts: "مكتبة القطع",
    suppliers: "الموردون",
    customers: "العملاء",
    orders: "الطلبات",
    documents: "المستندات",
    search: "بحث",
    settings: "الإعدادات",
    new: "جديد",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    loading: "جاري التحميل...",
    noResults: "لا توجد نتائج",
    searchPlaceholder: "بحث عن أرقام VIN أو قطع أو موردين...",
  },
};

export function I18nProvider({ children, initialLanguage = "en" }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const t = (key: string) => {
    return translations[language]?.[key] ?? key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
