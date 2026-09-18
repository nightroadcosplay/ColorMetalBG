export type TTip = {
    appid: number;
    size_type_ro: string;
    size_type_en: string|null;
    size_type_bg: string|null;
    type_id: string;
    pid_category: number;
}

// A type's name in each language, as sent by /nomenclatoare/tipuri.
export type TNomTip = {
    pid_category: number;
    size_type_ro: string;
    size_type_en: string|null;
    size_type_bg: string|null;
}
