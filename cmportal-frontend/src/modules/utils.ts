/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import moment, {Moment} from 'moment';
import dayjs from 'dayjs';
//Every language the portal offers; 'en' is dayjs's own default.
import 'dayjs/locale/ro'
import 'dayjs/locale/bg'
import 'dayjs/locale/hu'
import { scroll } from 'quasar';
const { getScrollTarget, setVerticalScrollPosition } = scroll;
import relativeTime from 'dayjs/plugin/relativeTime';
import {TPossibleOfferStatus} from "@/types/TPossibleOfferStatus";
dayjs.extend(relativeTime)

//The locale is applied per date instead of globally with dayjs.locale(): the
//global setting left "expires in 3 days" and month names in Romanian whatever
//language was selected. Callers pass the locale they are rendering in.
const DATE_LOCALES = ['ro', 'en', 'bg', 'hu'];
function dateLocale(plocale?: string): string {
    const locale = (plocale || '').toLowerCase();
    return DATE_LOCALES.includes(locale) ? locale : 'en';
}
export function getBase64Image(img:any) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if(ctx){
        ctx.drawImage(img, 0, 0);
    }
    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

export function humanStatusOffer(pstatus:TPossibleOfferStatus):string {
    //return EnumStatusOferta[pstatus];
    let result='';
    switch (pstatus) {
        case 'o':
            result = "oferta primita";
            break;
        case 'c':
            result = "anulata";
            break;
        case 'p':
            result = "cerere trimisa";
            break;
        case 'k':
            result = "comanda trimisa";
            break;
        default:
            result = "error";
    }

    return result;
}

export function dateToStringDDMonYYYY(pDate: Moment) {
    return moment(pDate).format('D MMM YYYY');
}

export function timeUntilNow(pStringDate: string, pformat:string, plocale?:string) {
    const locale = dateLocale(plocale);
    let result='';
    if(pStringDate && pStringDate.length==10){
        result = dayjs(pStringDate,pformat).locale(locale).fromNow();
    }
    if(pStringDate && pStringDate.length==16){
        result = dayjs(pStringDate,pformat).locale(locale).fromNow();
    }
    return result;
}

export function timeUntilFutureDate(pStringDate: string, pformat:string, plocale?:string) {
    const locale = dateLocale(plocale);
    let result='';
    if(pStringDate && pStringDate.length==10){
        result = dayjs(pStringDate,pformat).locale(locale).fromNow();
    }
    if(pStringDate && pStringDate.length==16){
        result = dayjs(pStringDate,pformat).locale(locale).fromNow();
    }
    return result;
}

export function timeDateHuman(pStringDate: string, pformat:string, plocale?:string) {
    const locale = dateLocale(plocale);
    let result='';
    if(pStringDate && pStringDate.length==10){
        result = dayjs(pStringDate,pformat).locale(locale).format('D MMM YYYY');
    }
    if(pStringDate && pStringDate.length==16){
        result = dayjs(pStringDate,pformat).locale(locale).format('D MMM YYYY');
    }
    return result;
}

export function minutesAfterNow(pStringDate: string, pformat:string):number {
    const date1=dayjs(pStringDate,pformat);
    const dateNow = dayjs();
    return dateNow.diff(date1,'minute');
}

export function getCurrentDateAsString(pformat:string):string{
    const d = new Date();
    const month = 1*d.getMonth() + 1;
    const day = 1*d.getDate();
    const year = 1*d.getFullYear();
    let result='';
    switch(pformat) {
        case 'dd.mm.yyyy':
            result=(day<=9?'0':'')+day+'.'+(month<=9?'0':'')+month+'.'+year;
            break;
        case 'dd-mm-yyyy':
            result=(day<=9?'0':'')+day+'-'+(month<=9?'0':'')+month+'-'+year;
            break;
        default:
            result=(day<=9?'0':'')+day+'.'+(month<=9?'0':'')+month+'.'+year;
    }
    return result;
}

export function getLastYearFirstDayDateAsString(pformat:string):string{
    const d = new Date();
    const month = 1;
    const day = 1;
    const year = 1*d.getFullYear() - 1;
    let result='';
    switch(pformat) {
        case 'dd.mm.yyyy':
            result=(day<=9?'0':'')+day+'.'+(month<=9?'0':'')+month+'.'+year;
            break;
        case 'dd-mm-yyyy':
            result=(day<=9?'0':'')+day+'-'+(month<=9?'0':'')+month+'-'+year;
            break;
        default:
            result=(day<=9?'0':'')+day+'.'+(month<=9?'0':'')+month+'.'+year;
    }
    return result;
}

export function slugify(pstring:string):string {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return pstring.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export function humanReadableBytes(bytes:number):string {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

export function scrollToElementById(p_id_of_element:string,poffset:number, pduration:number){
    const el: HTMLElement = document.getElementById(p_id_of_element)!;
    let offset = el.offsetTop;
    let duration = 300;
    const target = getScrollTarget(el)
    if(poffset){
        offset = el.offsetTop+poffset
    }
    if(pduration){
        duration = pduration;
    }
    setVerticalScrollPosition(target, offset, duration);
  //  setVerticalScrollPosition, setHorizontalScrollPosition
}

export function ValidateEmail(mailString:string):boolean
{
    let result=false;
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(mailString) == false)
    {
        result=false;
    }else{
        result=true;
    }
    return result;
}

export function parsePostgresArray(str: string) {
    // Remove outer braces, split by comma
    // e.g. "{123,456}" -> ["123", "456"]
    return str
      .replace(/[{}]/g, "")  // remove { and }
      .split(",")            // split by comma
      .filter(Boolean)       // remove empty strings if any
  }

export function getFirstCategory(categpries: string) {
    return parsePostgresArray(categpries)[0];
}
