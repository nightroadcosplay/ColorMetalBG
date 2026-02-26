export type TOptionCategory={
    pid: string,
    name_ro:string;
    name_en:string;
    name_bg:string;
    categories:TOptionCategory[],
    withLength:string,
    withWidth:string,
    withThickness:string,
    withDiameter:string,
    withHeight: string;
    withAlloy: string;
    withType: string;
    lantHierarchyCategoriesRO: string;
    lantHierarchyCategoriesEN: string;
    lantHierarchyCategoriesBG: string;
}
