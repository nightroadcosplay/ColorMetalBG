export type TCategory = {
    appid:string;
    pid:string;
    parent_pid:string;
    name_ro:string;
    name_en:string;
    name_bg:string;
    category_level:string;
    withLength: string;
    withWidth: string;
    withThickness: string;
    withDiameter: string;
    withHeight: string;
    withAlloy: string;
    withType: string;
    withRollWeight: string;
    is_parent_for_articles: string;
    positionLength: number;
    positionWidth: number;
    positionThickness: number;
    positionDiameter: number;
    positionHeight: number;
    positionAlloy: number;
    positionType: number;
    positionRollWeight: number;
    children:TCategory[]|null
}
