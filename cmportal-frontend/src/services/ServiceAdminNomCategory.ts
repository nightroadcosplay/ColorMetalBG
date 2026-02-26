import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import {TCategory} from "@/types/TCategory";
import {TOptionCategory} from "@/types/TOptionCategory";
import {TDimensionsOrder} from "@/types/TDimensionsOrder";
import {TUm1Um2} from "@/types/TUm1Um2";
import { TCategoryTip } from '@/types/TCategoryTip';
import { TTip } from '@/types/TTip';

interface TAjaxResponseSimple {
    status: string;
    message: string;
}

type TAjaxResponseGetCategory= {
    status: string;
    message: string;
    category:TCategory&TUm1Um2&{parent_name:string}&{hasChilds:string};
}

interface TAjaxResponseGetNomCategory {
    status: string;
    message: string;
    treeDataCategories:TCategory[];
}

interface TAjaxResponseGetNomCategoryList {
    status: string;
    message: string;
    listDataCategories:TOptionCategory[];
}

interface TAjaxResponseGetNomCategoryTipuri {
    status: string;
    message: string;
    treeDataCategories:TCategoryTip[];
}

interface TAjaxResponseGetNomCategoryTip {
    status: string;
    message: string;
    tip:TTip;
}

interface TAjaxResponseGetNomCategoryTipImages {
    status: string;
    message: string;
    image1: string;
    image2: string;
    image3: string;
}

export class ServiceAdminNomCategory {
    public static async getNomCategoryTreeData(): Promise<TAjaxResponseGetNomCategory> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.treeDataCategories}/${rnd}`);
        return response.data;
    }

    public static async getNomCategorylistData(): Promise<TAjaxResponseGetNomCategoryList> {
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.listDataCategories}/${rnd}`);
        return response.data;
    }

    public static async postCategory(pcategory: TCategory&TDimensionsOrder&TUm1Um2&{img:any|null}): Promise<TAjaxResponseSimple> {
        const param = new FormData(); //Create a form object
        param.append('file', pcategory.img);//Add data to the form object via append
        param.append('pid', pcategory.pid);
        param.append('parent_pid', pcategory.parent_pid);
        param.append('name_ro', pcategory.name_ro);
        param.append('name_en', pcategory.name_en);
        param.append('name_bg', pcategory.name_bg);
        param.append('with_length', pcategory.withLength);
        param.append('with_width', pcategory.withWidth);
        param.append('with_thickness', pcategory.withThickness);
        param.append('with_diameter', pcategory.withDiameter);
        param.append('with_height', pcategory.withHeight);
        param.append('with_alloy', pcategory.withAlloy);
        param.append('with_type', pcategory.withType);
        param.append('with_roll_weight', pcategory.withRollWeight);
        param.append('length_position', pcategory.positionLength.toString());
        param.append('width_position', pcategory.positionWidth.toString());
        param.append('diameter_position', pcategory.positionDiameter.toString());
        param.append('thickness_position', pcategory.positionThickness.toString());
        param.append('height_position', pcategory.positionHeight.toString());
        param.append('alloy_position', pcategory.positionAlloy.toString());
        param.append('type_position', pcategory.positionType.toString());
        param.append('roll_weight_position', pcategory.positionRollWeight.toString());
        param.append('um1', pcategory.um1||'');
        param.append('um2', pcategory.um2||'');
        param.append('is_parent_for_articles', pcategory.is_parent_for_articles);

        const config = {
            headers: {'Content-Type': 'multipart/form-data'}
        };
        //const params = new URLSearchParams();
        //params.set('name', pcategory.name);
        //params.set('img', pcategory.img);
        let response;
        if(pcategory.pid){
            response = await axios.post(`${CONFIG_ENV.URL_ADMIN.nomCategory}/${pcategory.pid}`, param, config);
        }else{
            response = await axios.post(`${CONFIG_ENV.URL_ADMIN.nomCategory}`, param, config);
        }

        return response.data;
    }

    public static async deleteCategory(pid:string): Promise<TAjaxResponseSimple> {
        const response = await axios.delete(`${CONFIG_ENV.URL_ADMIN.nomCategory}/${pid}`);
        return response.data;
    }

    public static async getCategory(pid:string): Promise<TAjaxResponseGetCategory> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.nomCategory}/${pid}`);
        return response.data;
    }

    public static async getImageCategoryAsString(pid:string): Promise<string> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.imageCategoryAsString}/${pid}`);
        return response.data;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static async getProfileImgAsString(puserappid:string) {
        const res = await  <Promise<string>>  axios.get(`${CONFIG_ENV.URL_USER.getMyImageProfileAsString}/${puserappid}`);
        return res;
    }
    
    public static async sincronizareTipuri(): Promise<TAjaxResponseSimple> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.sincronizareTipuri}`);
        return response.data;
    }

    public static async getTipuri(): Promise<TAjaxResponseGetNomCategoryTipuri>{
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.get_tipuri}/${rnd}`);
        return response.data;
    }

    
    public static async getTip(appid: number): Promise<TAjaxResponseGetNomCategoryTip>{
        const rnd=Math.random();
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.get_tip}/${appid}`);
        return response.data;
    }
    
    public static async getImagesCategoryAsStringTip(type_id:string): Promise<TAjaxResponseGetNomCategoryTipImages> {
        const response = await axios.get(`${CONFIG_ENV.URL_ADMIN.imagesCategoryAsStringTip}/${type_id}`);
        return response.data;
    }

    public static async postTip(tip: TTip&{img1:any|null,img2:any|null,img3:any|null}): Promise<TAjaxResponseSimple>{
        const param = new FormData(); //Create a form object
        param.append('file1', tip.img1);//Add data to the form object via append
        param.append('file2', tip.img2);//Add data to the form object via append
        param.append('file3', tip.img3);//Add data to the form object via append
        param.append('size_type', tip.size_type);
        param.append('pid_category', tip.pid_category.toString());
        param.append('appid', tip.appid.toString());
        param.append('type_id', tip.type_id);
        const config = {
            headers: {'Content-Type': 'multipart/form-data'}
        };
        const response = await axios.post(`${CONFIG_ENV.URL_ADMIN.saveTip}`, param, config);

        return response.data;
    }

    public static async deleteFile(filePath:string): Promise<TAjaxResponseSimple> {
        const params = new URLSearchParams();
        params.set('filePath', filePath);
        const response = await axios.post(`${CONFIG_ENV.URL_ADMIN.delete_file}`, params);
        return response.data;
    }
}
