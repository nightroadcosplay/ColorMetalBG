import {TProductBasket} from '@/types/TProductBasket';
export type TOffer = {
    offerId: string;
    status: string;
    trackCreationDate: string;
    nrComandaCerere: string;
    termenCerere: string;
    basket:TProductBasket[];
    offerSlid:string;
}
