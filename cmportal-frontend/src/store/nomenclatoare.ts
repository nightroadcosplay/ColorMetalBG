import store from './index';
import {Module, VuexModule, Mutation, Action, getModule} from 'vuex-module-decorators';
import {TCountry} from '@/types/TCountry';
import {TJudet} from '@/types/TJudet';
import {TAssocArray} from '@/types/TAssocArray';
import {TOptionCategory} from "@/types/TOptionCategory";
import {ServiceAdminNomCategory} from "@/services/ServiceAdminNomCategory";
import {ServiceAdminNomProducts} from "@/services/ServiceAdminNomProducts";
import {EnumUM} from "@/types/EnumUM";
import {TNomTip} from "@/types/TTip";

@Module({ namespaced: true, dynamic: true, store, name: 'storeNomenclatoare'})
export default class Nomenclatoare extends VuexModule {
    public currentPageTitle ='';
    public nomCategIsOK = false;
    public nomTipDocIsOK = false;
    public nomCountries: TCountry[]=[];
    public nomJudete: TJudet[]=[];
    public isLoadingNomenclatoare = false;
    public optionsCategories:TOptionCategory[]=[];
    public optionsUM:EnumUM[]=['','BUC','KG','ML','M2'];
    public minLengthPlaci = 50;
    public minLengthBare = 50;
    public maxLengthPlaci = 3020;
    public maxLengthBare = 3000;
    public nomTipuri: TNomTip[] = [];

    @Mutation
    public SET_NOM_TIPURI(ptipuri: TNomTip[]) {
        this.nomTipuri = JSON.parse(JSON.stringify(ptipuri));
    }

    @Mutation
    public SET_CURRENTPAGETITLE(ptitle: string) {
        this.currentPageTitle = JSON.parse(JSON.stringify(ptitle));
    }
    @Action
    public set_currentpagetitle(ptitle: string) {
        this.context.commit('SET_CURRENTPAGETITLE', ptitle);
    }

    @Mutation
    public SET_COUNTRIES(pcountries: TCountry[]) {
        this.nomCountries = JSON.parse(JSON.stringify(pcountries));
    }

    @Action
    public set_countries(pcountries: TCountry[]) {
        this.context.commit('SET_COUNTRIES', pcountries);
    }

    @Mutation
    public SET_JUDETE(pjudete: TJudet[]) {
        this.nomJudete = JSON.parse(JSON.stringify(pjudete));
    }

    @Action
    public set_judete(pjudete: TJudet[]) {
        this.context.commit('SET_JUDETE', pjudete);
    }

    @Mutation
    public SET_CATEGORIES(pcategories: TOptionCategory[]) {
        this.optionsCategories = JSON.parse(JSON.stringify(pcategories));
    }

    @Action
    public set_categories(pcategories: TOptionCategory[]) {
        this.context.commit('SET_CATEGORIES', pcategories);
    }

    @Action
    public get_categories_fromDB() {
        const vueInst=this;
        ServiceAdminNomCategory.getNomCategorylistData().then(response=>{
            if(response.status=='success'){
                vueInst.context.commit('SET_CATEGORIES', JSON.parse(JSON.stringify(response.listDataCategories)));
            }
        })

    }

    @Mutation
    public SET_LOADING_NOMENCLATOARE(pstatus: boolean) {
        this.isLoadingNomenclatoare = pstatus;
    }

    @Action
    public set_loading_nomenclatoare(pstatus: boolean) {
        this.context.commit('SET_LOADING_NOMENCLATOARE', pstatus);
    }

    @Action
    public async getNomenclatoare(){
        console.log('%cgetNomenclatoareAndGoToRequestedComponent<-------------------------', "color: red;font-size:16px;")
        const vueInst = this;
        const willUpdateStoreNomCategFromDB = new Promise(
            (resolve, reject) => {
                console.log('%cwillUpdateStoreNomCategFromDB from app.ts', "color: red;font-size:16px;");
                ServiceAdminNomCategory.getNomCategorylistData().then((presponse) => {
                    if (presponse.status === 'success') {
                        vueInst.context.commit('SET_CATEGORIES', JSON.parse(JSON.stringify(presponse.listDataCategories)));
                        resolve('success');
                    } else {
                        reject('error');
                    }
                });
            });
        const willUpdateStoreNomTipDocsFromDB = new Promise(
            (resolve, reject) => {
                resolve('success');
            });
        // Type labels only: if they fail to load, types show their RO text, so
        // this never holds up the app.
        const willUpdateStoreNomTipuriFromDB = new Promise(
            (resolve) => {
                ServiceAdminNomCategory.getNomTipuri().then((presponse) => {
                    if (presponse.status === 'success') {
                        vueInst.context.commit('SET_NOM_TIPURI', presponse.tipuri);
                    }
                    resolve('success');
                }).catch(() => resolve('success'));
            });
        const result = await Promise.all([willUpdateStoreNomCategFromDB, willUpdateStoreNomTipDocsFromDB, willUpdateStoreNomTipuriFromDB])
            .then(result => {
                console.log('Promise.all cu succes!');
                return 'success';
            })
            .catch(error => console.log(`Error in executing getNomenclatoareAndGoToRequestedComponent ${error}`));
        return result;
    }
}
