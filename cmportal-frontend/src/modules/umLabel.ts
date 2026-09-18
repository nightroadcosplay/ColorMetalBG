// Translate a unit-of-measure value (stored in the DB in any language, e.g.
// 'БРОЙ' / 'BUC' / 'PCS' for pieces) into the label for the active locale.
// Pieces and kilograms have per-language labels (i18n keys); every other unit
// (M2, ML, ...) is language-neutral and shown exactly as stored.

const UM_PIECES = new Set(['BUC', 'PCS', 'БРОЙ', 'БР', 'DB']);
const UM_KG = new Set(['KG', 'КГ']);

// True when a unit-of-measure value means kilograms, in any of the languages
// the DB stores it in.
export function isUmKg(raw: unknown): boolean {
    if (raw === null || raw === undefined) return false;
    return UM_KG.has(String(raw).trim().toUpperCase());
}

export function umLabel(raw: unknown, t: (key: string) => string): string {
    if (raw === null || raw === undefined) return '';
    const v = String(raw).trim();
    if (v === '') return '';
    const up = v.toUpperCase();
    if (UM_PIECES.has(up)) return t('message.pcs');
    if (UM_KG.has(up)) return t('message.kg');
    return v;
}
