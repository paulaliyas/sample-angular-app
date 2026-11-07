import { TranslateService } from '@ngx-translate/core';
import ar from './ar.json';
import en from './en.json';

export type InitiativeLang = 'en' | 'ar';

/**
 * Adds the initiative's texts to the app's TranslateService (merged, so the host app's own keys stay).
 * All keys sit under "initiative." so they can't clash with the host's.
 */
export function registerInitiativeTranslations(translate: TranslateService): void {
  translate.setTranslation('en', en, true);
  translate.setTranslation('ar', ar, true);
}

/** The current language, English when none is set yet */
export function currentLang(translate: TranslateService): InitiativeLang {
  return translate.getCurrentLang() === 'ar' ? 'ar' : 'en';
}
