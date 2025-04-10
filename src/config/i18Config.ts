import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to my website",
      description: "This is a multilingual app"
    }
  },
  vi: {
    translation: {
      welcome: "Chào mừng đến với trang web của tôi",
      description: "Đây là một ứng dụng đa ngôn ngữ"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
