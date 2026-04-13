import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import ptBR from "./locales/pt-BR";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  resources: {
    "pt-BR": { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
