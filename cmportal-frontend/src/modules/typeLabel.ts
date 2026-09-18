import {getModule} from 'vuex-module-decorators';
import nomenclatoare from '@/store/nomenclatoare';

// A type (nom_products.size_type, "k" on basket / favorites / offer rows) is
// stored and matched on its RO text; only the label is translated, from
// tipuri_mapare. Compared trimmed, as some RO texts carry a leading space.
// Without a translation the stored text is shown, so nothing ever goes blank.
//
// Languages other than ro / en get the BG name, the same rule the product
// names on these rows follow.
export function localizedTypeLabel(sizeType: string|null|undefined, locale: string): string {
    if (!sizeType) {
        return '';
    }
    const key = sizeType.trim();
    const tip = getModule(nomenclatoare).nomTipuri.find(t => (t.size_type_ro || '').trim() === key);
    if (!tip) {
        return sizeType;
    }
    const label = locale === 'ro' ? tip.size_type_ro
        : locale === 'en' ? tip.size_type_en
        : tip.size_type_bg;
    return label || sizeType;
}
