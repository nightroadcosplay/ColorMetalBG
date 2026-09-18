import { isUmKg } from '@/modules/umLabel';

// A missing or non-positive conversion factor behaves as 1, the way
// coreleazaUm1Um2 has always treated it.
export function effectiveUmRatio(um1ToUm2: unknown): number {
    const ratio = Number(um1ToUm2);
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

export type TKgQuantityContext = {
    // nom_category_product.kg_from_um2 for the article's category: 'y' when the
    // quantity is entered in um2 and the weight follows from it. Declared per
    // category because the placa/bara shape the backend derives also catches
    // flat bars, L/T/U profiles and square tubes.
    kgFromUm2: string | null | undefined;
    um1: string | null;
    um2: string | null;
    um1ToUm2: unknown;
    cutting: boolean;
};

// True when the KG figure would only repeat the um2 figure: the category enters
// its quantity in um2, nothing is being cut, um1 is KG and the conversion factor
// is 1, so both units hold the very same number.
//
// This hides the figure only. The value itself is always kept: it is what goes
// to sales, and on the browse screen it also gates "add to basket".
export function hideKgQuantity(ctx: TKgQuantityContext): boolean {
    const hasUm2 = !!(ctx.um2 && ctx.um2.length > 0);
    return ctx.kgFromUm2 === 'y'
        && !ctx.cutting
        && hasUm2
        && isUmKg(ctx.um1)
        && effectiveUmRatio(ctx.um1ToUm2) === 1;
}
