import { TFactura } from "./TFactura";

export type TOfferHeader = {
    offerId: string;
    offerSlid: string;
    status: string;
    trackCreationDate: string;
    trackDateOfertare: string;
    trackDateAccept: string;
    termenLivrareSolicitat: string;
    dateWhenOfferExpire: string;
    qKg:number|null;
    valFinalaFaraTvaRON:number|null;
    valTvaRON:number|null;
    valFinalaCuTvaRON:number|null;
    valFinalaFaraTvaEUR:number|null;
    valTvaEUR:number|null;
    valFinalaCuTvaEUR:number|null;
    valFinalaFaraTvaHUF:number|null;
    valTvaHUF:number|null;
    valFinalaCuTvaHUF:number|null;
    ComandaClient:string;
    idValuta:string|null;
    slidAdresaLivrare:number;
    val_discount_linii_ron:number|null;
    val_discount_oferta_ron:number|null;
    val_discount_linii_eur:number|null;
    val_discount_oferta_eur:number|null;
    val_discount_linii_huf:number|null;
    val_discount_oferta_huf:number|null;
    invoices:TFactura[]|null;
    observatii_asm:string;
    nume_utilizator:string;
    track_user_id:string;
}
