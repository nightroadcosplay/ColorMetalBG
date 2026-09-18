import { Quasar } from 'quasar';
import bg from 'quasar/lang/bg';
import en from 'quasar/lang/en-US';
import hu from 'quasar/lang/hu';
import ro from 'quasar/lang/ro';

const map: Record<string, unknown> = { bg, en, hu, ro };

export function getQuasarLang(locale: string): unknown {
    return map[locale] || ro;
}

export function setQuasarLang(locale: string): void {
    Quasar.lang.set(getQuasarLang(locale) as Parameters<typeof Quasar.lang.set>[0]);
}
