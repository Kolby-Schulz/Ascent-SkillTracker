import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enAuth from '../locales/en/auth.json';
import enDashboard from '../locales/en/dashboard.json';
import enSettings from '../locales/en/settings.json';
import enFriends from '../locales/en/friends.json';
import enNavigation from '../locales/en/navigation.json';
import enProfile from '../locales/en/profile.json';
import enAchievements from '../locales/en/achievements.json';
import enLeaderboard from '../locales/en/leaderboard.json';

// Import Spanish translations
import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esAuth from '../locales/es/auth.json';
import esDashboard from '../locales/es/dashboard.json';
import esSettings from '../locales/es/settings.json';
import esFriends from '../locales/es/friends.json';
import esNavigation from '../locales/es/navigation.json';
import esProfile from '../locales/es/profile.json';
import esAchievements from '../locales/es/achievements.json';
import esLeaderboard from '../locales/es/leaderboard.json';

i18n
  .use(LanguageDetector) // Detects user's browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        auth: enAuth,
        dashboard: enDashboard,
        settings: enSettings,
        friends: enFriends,
        navigation: enNavigation,
        profile: enProfile,
        achievements: enAchievements,
        leaderboard: enLeaderboard,
      },
      es: {
        common: esCommon,
        home: esHome,
        auth: esAuth,
        dashboard: esDashboard,
        settings: esSettings,
        friends: esFriends,
        navigation: esNavigation,
        profile: esProfile,
        achievements: esAchievements,
        leaderboard: esLeaderboard,
      },
    },
    fallbackLng: 'en', // Default language
    defaultNS: 'common', // Default namespace
    ns: ['common', 'home', 'auth', 'dashboard', 'settings', 'friends', 'navigation', 'profile', 'achievements', 'leaderboard'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Keys to lookup language from
      lookupLocalStorage: 'i18nextLng',
      // Cache user language
      caches: ['localStorage'],
    },
  });

export default i18n;
