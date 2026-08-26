export const defaultLocale = 'zh-CN' as const;
export const siteLocales = ['zh-CN', 'en'] as const;

export type SiteLocale = (typeof siteLocales)[number];

export function alternateLocale(locale: SiteLocale): SiteLocale {
  return locale === 'zh-CN' ? 'en' : 'zh-CN';
}
