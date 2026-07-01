import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import en from "./en";
import ar from "./ar";

const DICTS = { en, ar };
const STORAGE_KEY = "academy_lang";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || "en");
  const t = DICTS[lang];
  const dir = t.dir;

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, [dir, lang]);

  const setLang = useCallback((next) => {
    if (DICTS[next]) setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((current) => (current === "en" ? "ar" : "en"));
  }, []);

  // pages don't need to re-derive the Intl locale everywhere.
  const formatDate = useCallback(
    (isoDate) => {
      if (!isoDate) return "—";
      try {
        const d = new Date(isoDate);
        return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(d);
      } catch {
        return isoDate;
      }
    },
    [lang]
  );

  const formatNumber = useCallback(
    (num) => new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(num ?? 0),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, t, dir, setLang, toggleLang, formatDate, formatNumber, isRtl: dir === "rtl" }),
    [lang, t, dir, setLang, toggleLang, formatDate, formatNumber]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
