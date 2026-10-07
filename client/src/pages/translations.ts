import en from '../locale/en.json';
import hi from '../locale/hi.json';

export type Language = 'en' | 'hi';

export const translations = {
  en,
  hi
} as const;

export type Translation = typeof en;
export type ErrorKey = keyof Translation['errors'];
export type LoginTranslation = Translation['loginPage'];
export type LoginErrorKey = keyof LoginTranslation['errors'];

export const loginTranslations: Record<Language, LoginTranslation> = {
  en: en.loginPage,
  hi: hi.loginPage
};