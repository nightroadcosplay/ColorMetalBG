
import { TTip } from "./TTip";

export type TCategoryTip = {
    appid:string;
    pid:string;
    name_ro:string;
    name_en:string;
    name_bg:string;
    category_level:string;
    is_parent_for_articles: string;
    is_tip: string;
    tipuri: TTip[], 
    children: TCategoryTip[]|null
};