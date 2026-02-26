import {Prop,  Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceBrowseArticles} from '@/services/ServiceBrowseArticles';
import {ServiceFavorites} from "@/services/ServiceFavorites";
import {ServiceBasket} from "@/services/ServiceBasket";
import {ServiceProduct} from "@/services/ServiceProduct";
import {getModule} from "vuex-module-decorators";
import user from '@/store/user';
import basket from '@/store/basket';
import favorites from '@/store/favorites';
import nomenclatoare from '@/store/nomenclatoare';
import {getFavorites} from '@/modules/getFavorites'
import {TProductBasket} from '@/types/TProductBasket';
import {TEnumPlacaBara} from '@/types/TEnumPlacaBara';
import HierarchicalChainBrowseHeader from '@/components/HierarchicalChainBrowseHeader/HierarchicalChainBrowseHeader.vue'
import {getBasket} from "@/modules/getBasket";
import {CONFIG_ENV} from "@/config";
import latinize from 'latinize';
import eventbus from "@/store/eventbus";
import { ServiceAdminNomCategory } from '@/services/ServiceAdminNomCategory';
import { parsePostgresArray } from '@/modules/utils';

type TSize={
    "l":number,
    "w":number,
    "t":number,
    "d":number,
    "h":number,
    "a":string,
    "k":string,
    "g":number,
    "um1":string,
    "um2":string,
    "um1_to_um2":number,
    "cuDebitare":boolean
}

type TBrowseArticles={
    status: string;
    message: string;
    arrLength: Array<number>;
    arrWidth: Array<number>;
    arrThickness: Array<number>;
    arrDiameter: Array<number>;
    arrHeight:  Array<number>;
    arrAlloy:  Array<string>;
    arrType:  Array<string>;
    arrRollWeight: Array<number>;
    categoryName: string;
    categoryPid: number;
    isParentForArticles: string;
    withLength: string;
    withWidth: string;
    withThickness: string;
    withDiameter: string;
    withHeight: string;
    withAlloy: string;
    withType: string;
    withRollWeight: string;
    positionLength: number;
    positionWidth: number;
    positionThickness: number;
    positionDiameter: number;
    positionHeight: number;
    positionAlloy: number;
    positionType: number;
    positionRollWeight: number;
    arrSizes:TSize[];
    hierarchicalChain:number[];
}

type TProductBasketMarkedFavorites = TProductBasket & {isInFavorite:boolean};

@Options({
    name: "BrowseArticles",
    components: {HierarchicalChainBrowseHeader}
})
export default class BrowseArticles extends Vue {
    @Prop({ default: '0' }) public readonly pidCategory!: string;
    @Prop({ default: '0' }) public readonly productPid!: string;
    @Prop({ default: 'fromDashboard' }) public readonly typeOfAccess!: string;
    public inputFreeTextComments='';
    public nrBucati =0;
    public cuttingLength = 0;
    public cuttingWidth = 0;
    public densitate :number|null = 0;
    public typeOfArticle :TEnumPlacaBara=TEnumPlacaBara.others;
    public qUm1 = 0;
    public qUm2 = 0;
    declare public $refs: any;
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
    public msjErrorRuleCuttingLength = '';
    public msjErrorRuleCuttingWidth = '';
    public dialogTransitionShow='';
    public dialogTransitionHide='';
    public selectedUM1 = true;
    public selectedUM2 = true;
    public tip_um = 'um12';
    public stocArticol = 0;
    public pid='';
    public EventBusStore = getModule(eventbus);

    public paramArticles: TBrowseArticles={
        status: '',
        message: '',
        arrLength: [],
        arrWidth: [],
        arrThickness:[],
        arrDiameter: [],
        arrHeight: [],
        arrAlloy: [],
        arrType: [],
        arrRollWeight: [],
        categoryName: '',
        categoryPid: 0,
        isParentForArticles: '',
        withDiameter: 'n',
        withLength: 'n',
        withThickness: 'n',
        withWidth: 'n',
        withHeight: 'n',
        withAlloy: 'n',
        withType: 'n',
        withRollWeight: 'n',
        positionLength: 0,
        positionWidth: 0,
        positionThickness: 0,
        positionDiameter: 0,
        positionHeight: 0,
        positionAlloy: 0,
        positionType:0,
        positionRollWeight: 0,
        arrSizes: [],
        hierarchicalChain:[]
    }
    public possibleSizes:TSize[]=[];
    public productCode : string|null = null;
    //productPid
    public selectedLength: number|null = null;
    public selectedWidth: number|null = null;
    public selectedThickness: number|null = null;
    public selectedDiameter: number|null = null;
    public selectedHeight: number|null = null;
    public selectedAlloy: string|null = null;
    public selectedType: string|null = null;
    public selectedRollWeight: number|null = null;
    public selectedUm1: string|null = null;
    public selectedUm2: string|null = null;
    public selectedUm1ToUm2: number|null = null;
    public isPlacaAluminiu = '0';
    public dorescDebitare = false;
    public loadingStock = false;
    public labelStock = '';
    public selectedSize:TSize={
        "l":0,
        "w":0,
        "t":0,
        "d":0,
        "h":0,
        "a":'',
        "k":'',
        "g":0,
        "um1":'',
        "um2":'',
        "um1_to_um2":1,
        "cuDebitare":false
    }
    public userStore = getModule(user);
    public storeBasket = getModule(basket);
    public storeFavorites = getModule(favorites);
    public storeNomenclatoare = getModule(nomenclatoare);


    
    get msjErrorRuleIntegerNumberBuc (): string {
        return this.$t('message.va_rugam_treceti_un_numar_intreg') as string;
    }

    public thumbStyle = {
        right: '4px',
        borderRadius: '10px',
        backgroundColor: '#C2C6C8',
        width: '10px',
        opacity: 0.9
      }
    public barStyle = {
        right: '2px',
        borderRadius: '14px',
        backgroundColor: '#C2C6C8',
        width: '14px',
        opacity: 0.6
      }

    private initializeSelectedSize(){
        this.nrBucati=0;
        this.cuttingLength=0;
        this.cuttingWidth=0;
        this.qUm1=0;
        this.qUm2=0;
        this.dorescDebitare=false;
        this.selectedSize={
            "l":0,
            "w":0,
            "t":0,
            "d":0,
            "h":0,
            "a":'',
            "k":'',
            "g":0,
            "um1":'',
            "um2":'',
            "um1_to_um2":1,
            "cuDebitare":false
        }
    }

    public toggleArticleInFavorites(): void {
        const vueInst=this;
        if(!vueInst.articleCouldBePutInFavorites) {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                message: this.$t('message.check_all_features')
            })
            return;
        }else{
            vueInst.$q.loading.show();
            ServiceFavorites.identifyArticleInDBAndPutIntoFavorites(vueInst.paramArticles.categoryPid.toString(),vueInst.selectedLength,vueInst.selectedWidth,vueInst.selectedThickness, vueInst.selectedDiameter, vueInst.selectedHeight, vueInst.selectedAlloy, vueInst.selectedType, vueInst.selectedSize.um1, vueInst.selectedSize.um2, vueInst.qUm1, vueInst.qUm2, vueInst.selectedRollWeight)
                .then(response=>{
                    if(response.status=='success'){
                        vueInst.$q.loading.hide();
                        getFavorites();
                        vueInst.$q.notify({
                            color: 'red-6',
                            textColor: 'white',
                            icon: 'favorite',
                            position: 'top',
                            timeout: 500,
                            message: vueInst.$t('message.article_added_to_favorite')
                        })
                    }
                }).catch((error) => {
                vueInst.$q.loading.hide();
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    type: 'negative',
                    icon: 'error',
                    position: 'top',
                    timeout: 3000,
                    message: error.toString()
                })
            });

        }
    }

    public setSize(sizeName: string, sizeValue: number|string): void {
        console.log('set size');
        const vueInst = this;
        let isSelectedLengthOk = false;
        let isSelectedWidthOk = false;
        let isSelectedThicknessOk = false;
        let isSelectedDiameterOk = false;
        let isSelectedHeightOk = false;
        let isSelectedAlloyOk = false;
        let isSelectedTypeOk = false;
        let isSelectedRollWeight = false;
        vueInst.initializeSelectedSize();
        // console.log(sizeName, sizeValue, vueInst.selectedLength, isSelectedLengthOk);
        switch (sizeName) {
            case 'l':
                if (vueInst.selectedLength && vueInst.selectedLength == Number(sizeValue)) {
                    vueInst.selectedLength = null;
                } else {
                    vueInst.selectedLength = Number(sizeValue);
                }
                break;
            case 'w':
                if (vueInst.selectedWidth && vueInst.selectedWidth == Number(sizeValue)) {
                    vueInst.selectedWidth = null;
                } else {
                    vueInst.selectedWidth = Number(sizeValue);
                }
                break;
            case 't':
                if (vueInst.selectedThickness && vueInst.selectedThickness == Number(sizeValue)) {
                    vueInst.selectedThickness = null;
                } else {
                    vueInst.selectedThickness = Number(sizeValue);
                }
                break;
            case 'd':
                if (vueInst.selectedDiameter && vueInst.selectedDiameter == Number(sizeValue)) {
                    vueInst.selectedDiameter = null;
                } else {
                    vueInst.selectedDiameter = Number(sizeValue);
                }
                break;
            case 'h':
                if (vueInst.selectedHeight && vueInst.selectedHeight == Number(sizeValue)) {
                    vueInst.selectedHeight = null;
                } else {
                    vueInst.selectedHeight = Number(sizeValue);
                }
                break;
            case 'a':
                if (vueInst.selectedAlloy && vueInst.selectedAlloy == sizeValue) {
                    vueInst.selectedAlloy = null;
                } else {
                    vueInst.selectedAlloy = sizeValue.toString();
                }
                break;
            case 'k':
                if (vueInst.selectedType && vueInst.selectedType == sizeValue) {
                    vueInst.selectedType = null;
                } else {
                    vueInst.selectedType = sizeValue.toString();
                }
                break;
            case 'g':
                if (vueInst.selectedRollWeight && vueInst.selectedRollWeight == sizeValue) {
                    vueInst.selectedRollWeight = null;
                } else {
                    vueInst.selectedRollWeight = Number(sizeValue);
                }
                break;
        }
        
        // console.log(sizeName, sizeValue, vueInst.selectedLength, isSelectedLengthOk);
        vueInst.possibleSizes = JSON.parse(JSON.stringify(vueInst.paramArticles.arrSizes));
        if (vueInst.selectedLength) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.l == vueInst.selectedLength;
            })
        }
        if (vueInst.selectedWidth) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.w == vueInst.selectedWidth;
            })
        }
        if (vueInst.selectedThickness) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.t == vueInst.selectedThickness;
            })
        }

        if (vueInst.selectedDiameter) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.d == vueInst.selectedDiameter;
            })
        }

        if (vueInst.selectedHeight) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.h == vueInst.selectedHeight;
            })
        }

        if (vueInst.selectedAlloy) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.a == vueInst.selectedAlloy;
            })
        }

        if (vueInst.selectedType) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.k == vueInst.selectedType;
            })
        }

        if (vueInst.selectedRollWeight) {
            vueInst.possibleSizes = vueInst.possibleSizes.filter(size => {
                return size.g == vueInst.selectedRollWeight;
            })
        }

        vueInst.possibleSizes.forEach(size => {
            if (vueInst.paramArticles.withLength == 'y') {
                if (size.l == vueInst.selectedLength) {
                    isSelectedLengthOk = true;
                }
            }
            if (vueInst.paramArticles.withWidth == 'y') {
                if (size.w == vueInst.selectedWidth) {
                    isSelectedWidthOk = true;
                }
            }
            if (vueInst.paramArticles.withThickness == 'y') {
                if (size.t == vueInst.selectedThickness) {
                    isSelectedThicknessOk = true;
                }
            }
            if (vueInst.paramArticles.withDiameter == 'y') {
                if (size.d == vueInst.selectedDiameter) {
                    isSelectedDiameterOk = true;
                }
            }
            if (vueInst.paramArticles.withHeight == 'y') {
                if (size.h == vueInst.selectedHeight) {
                    isSelectedHeightOk = true;
                }
            }
            if (vueInst.paramArticles.withAlloy == 'y') {
                if (size.a == vueInst.selectedAlloy) {
                    isSelectedAlloyOk = true;
                }
            }
            if (vueInst.paramArticles.withType == 'y') {
                if (size.k == vueInst.selectedType) {
                    isSelectedTypeOk = true;
                }
            }
            if (vueInst.paramArticles.withRollWeight == 'y') {
                if (size.g == vueInst.selectedRollWeight) {
                    isSelectedRollWeight = true;
                }
            }
        })
        if (!isSelectedLengthOk) {
            vueInst.selectedLength = null
        }
        if (!isSelectedWidthOk) {
            vueInst.selectedWidth = null
        }
        if (!isSelectedThicknessOk) {
            vueInst.selectedThickness = null
        }
        if (!isSelectedDiameterOk) {
            vueInst.selectedDiameter = null
        }
        if (!isSelectedHeightOk) {
            vueInst.selectedHeight = null
        }
        if (!isSelectedAlloyOk) {
            vueInst.selectedAlloy = null
        }
        if (!isSelectedTypeOk) {
            vueInst.selectedType = null
        }
        if (!isSelectedRollWeight) {
            vueInst.selectedRollWeight = null
        }
        // console.log(sizeName, sizeValue, vueInst.selectedLength, isSelectedLengthOk);

        const sizeSelected = vueInst.paramArticles.arrSizes.find((size: TSize) => {
            if (((size.a && size.a == vueInst.selectedAlloy) || !size.a)
                && ((size.d && size.d == vueInst.selectedDiameter) || !size.d)
                && ((size.h && size.h == vueInst.selectedHeight) || !size.h)
                && ((size.k && size.k == vueInst.selectedType) || !size.k)
                && ((size.l && size.l == vueInst.selectedLength) || !size.l)
                && ((size.t && size.t == vueInst.selectedThickness) || !size.t)
                && ((size.w && size.w == vueInst.selectedWidth) || !size.w)
                && ((size.g && size.g == vueInst.selectedRollWeight) || !size.g)
            ) {
                return true;
            }
        })
        if(sizeSelected){//vueInst.selectedSize=sizeSelected //asta a fost inainte de sa trag um la fiecare produs
            vueInst.selectedSize.um1='';
            vueInst.selectedSize.um2='';
            vueInst.selectedSize.um1_to_um2=1;
            vueInst.selectedSize.cuDebitare=false;
            vueInst.$q.loading.show();
            vueInst.getUm1Um2Forprodus();
        }
    }


    public getUm1Um2Forprodus(): void {
        const vueInst=this;
        vueInst.loadingStock = true;
        vueInst.labelStock = vueInst.$t('message.check_stock');
        ServiceBrowseArticles.identifyArticleInDB(vueInst.paramArticles.categoryPid.toString(), vueInst.selectedLength, vueInst.selectedWidth, vueInst.selectedThickness, vueInst.selectedDiameter, vueInst.selectedHeight, vueInst.selectedAlloy, vueInst.selectedType, vueInst.selectedRollWeight)
            .then(response => {
                vueInst.$q.loading.hide();
                console.log('getUm1Um2Forprodus=%o', response)
                if (response.status == 'success') {
                    vueInst.selectedSize.um1=response.um1;
                    vueInst.selectedSize.um2=response.um2;
                    vueInst.productCode=response.productCode;
                    vueInst.typeOfArticle=response.enumPlacaBara;
                    vueInst.densitate=response.densitate;
                    vueInst.isPlacaAluminiu=response.isPlacaAluminiu;
                    vueInst.selectedSize.um1_to_um2=response.um1ToUm2*1;
                    if(vueInst.typeOfArticle == 'placa' && response.cuDebitare=='y'){
                        vueInst.dorescDebitare = true;
                    }
                    vueInst.selectedSize.cuDebitare=(response.cuDebitare=='y'? true : false);
                    ServiceProduct.getArticleStock(response.productCode).then(response => {
                        vueInst.loadingStock = false;
                        console.log(response);
                        vueInst.stocArticol = response.itemStock;
                        if(response.itemStock > 0) {
                            vueInst.labelStock = vueInst.$t('message.in_stock');
                        } else {
                            vueInst.labelStock = vueInst.$t('message.in_process_supply');
                        }
                    });
                }
            }).catch((error) => {
            vueInst.$q.loading.hide();
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                icon: 'error',
                position: 'top',
                timeout: 3000,
                message: error.toString()
            })
        });
    }

    public isLengthAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.l==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isWidthAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.w==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isThicknessAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.t==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isDiameterAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.d==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isHeightAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.h==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isAlloyAvailable(sizeValue: string):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.a==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isTypeAvailable(sizeValue: string):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.k==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public isRollWeightAvailable(sizeValue: number):boolean{
        const vueInst=this;
        let result=false;
        const sizeExist=vueInst.possibleSizes.find(size=>{
            return size.g==sizeValue;
        })
        if(sizeExist){result=true;}
        return result;
    }

    public get HideUm1IfBucDebit():boolean{
        if(this.dorescDebitare && this.selectedSize.um1 && this.selectedSize.um1==='BUC'){
            return true;
        }
        else{return false;}
    }

    public get HideUm2IfBucDebit():boolean{
        if(this.dorescDebitare && this.selectedSize.um2 && this.selectedSize.um2==='BUC'){
            return true;
        }
        else{return false;}
    }

    public changeTipUm(val: boolean, tip: number): void {
       
        if(!this.selectedUM1 && !this.selectedUM2) {
            if(tip == 1) {
                this.selectedUM2 = true;
            } else {
                this.selectedUM1 = true;
            }
        }
        if(this.selectedSize.um1 == '' || this.selectedSize.um1 == null) {
            this.selectedUM2 = true;
        }
        if(this.selectedSize.um2 == '' || this.selectedSize.um2 == null) {
            this.selectedUM1 = true;
        }
        if(this.selectedUM1 && this.selectedUM2) {
            this.tip_um = 'um12';
        } else if(this.selectedUM1) {
            this.tip_um = 'um1';
        } else if(this.selectedUM2) {
            this.tip_um = 'um2';
        }
    }

    public addProductToBasket(): void {
        const vueInst=this;
        if(this.typeOfArticle==='placa' && this.cuttingLength>1520  && this.cuttingWidth>1520 && this.dorescDebitare) {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_both')
            })
            return;
        } 
        else if(this.typeOfArticle==='placa' && (this.cuttingLength<50  || this.cuttingWidth<50)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_smaller')
            })
            return;
        } else if(this.typeOfArticle==='placa' && (this.cuttingLength>3020  || this.cuttingWidth>3020)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message:this.$t('message.length_bigger')
            })
            return;
        } else if((vueInst.pid == '36' || vueInst.pid == '56' || vueInst.pid == '8' || vueInst.pid == '7') && (this.cuttingLength < 10 || this.cuttingLength > 3000)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_between')
            })
            return;
        } else if(this.selectedSize.um2 == 'BUC' && !Number.isInteger(this.qUm2) && this.selectedUM2) {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.insert_integer')
            })
            return;
        }
        else {
            if (!vueInst.articleCouldBePutInBasket) {
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    icon: 'error',
                    position: 'top',
                    timeout: 1500,
                    html: true,
                    message: this.$t('message.check_all_features')
                })
                return;
            } else {
                vueInst.$q.loading.show();
                ServiceBasket.identifyArticleInDBAndPutIntoBasket(vueInst.paramArticles.categoryPid.toString()
                    , vueInst.selectedLength
                    , vueInst.selectedWidth
                    , vueInst.selectedThickness
                    , vueInst.selectedDiameter
                    , vueInst.selectedHeight
                    , vueInst.selectedAlloy
                    , vueInst.selectedType
                    , vueInst.selectedRollWeight
                    , vueInst.selectedSize.um1
                    , vueInst.selectedSize.um2
                    , vueInst.qUm1
                    , vueInst.qUm2
                    , vueInst.nrBucati
                    , vueInst.dorescDebitare
                    , vueInst.cuttingLength
                    , vueInst.cuttingWidth
                    , latinize(vueInst.inputFreeTextComments)
                    , vueInst.tip_um)
                    .then(response => {
                        if (response.status == 'success') {
                            getBasket();
                            vueInst.onPidCategoryChanged(vueInst.pidCategory);
                            vueInst.$q.loading.hide();
                            vueInst.$q.notify({
                                color: 'orange-9',
                                textColor: 'white',
                                icon: 'shopping_cart',
                                position: 'top',
                                timeout: 1000,
                                message: response.message
                            })
                        }
                    }).catch((error) => {
                    vueInst.$q.loading.hide();
                    vueInst.$q.notify({
                        color: 'red',
                        textColor: 'white',
                        type: 'negative',
                        icon: 'error',
                        position: 'top',
                        timeout: 3000,
                        message: error.toString()
                    })
                });

            }
        }
    }


    public addProductToCerere(): void {
        const vueInst=this;
        if(this.typeOfArticle==='placa' && this.cuttingLength>1520  && this.cuttingWidth>1520 && this.dorescDebitare) {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_both')
            })
            return;
        } 
        else if(this.typeOfArticle==='placa' && (this.cuttingLength<50  || this.cuttingWidth<50)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_smaller')
            })
            return;
        } else if(this.typeOfArticle==='placa' && (this.cuttingLength>3020  || this.cuttingWidth>3020)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message:this.$t('message.length_bigger')
            })
            return;
        } else if((vueInst.pid == '36' || vueInst.pid == '56' || vueInst.pid == '8' || vueInst.pid == '7') && (this.cuttingLength < 10 || this.cuttingLength > 3000)  && this.dorescDebitare){
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.length_between')
            })
            return;
        } else if(this.selectedSize.um2 == 'BUC' && !Number.isInteger(this.qUm2) && this.selectedUM2) {
            vueInst.$q.notify({
                color: 'red',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                timeout: 1500,
                html: true,
                message: this.$t('message.insert_integer')
            })
            return;
        }
        else {
            if (!vueInst.articleCouldBePutInBasket) {
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    icon: 'error',
                    position: 'top',
                    timeout: 1500,
                    html: true,
                    message: this.$t('message.check_all_features')
                })
                return;
            }
            if (vueInst.pidCategory != vueInst.paramArticles.categoryPid.toString()) {
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    icon: 'error',
                    position: 'top',
                    timeout: 1500,
                    message: this.$t('message.errors_app')
                })
            } else {
                vueInst.$q.loading.show();
                ServiceBrowseArticles.identifyArticleInDB(vueInst.paramArticles.categoryPid.toString(), vueInst.selectedLength, vueInst.selectedWidth, vueInst.selectedThickness, vueInst.selectedDiameter, vueInst.selectedHeight, vueInst.selectedAlloy, vueInst.selectedType, vueInst.selectedRollWeight)
                    .then(response => {
                        if (response.status == 'success') {
                            vueInst.$q.loading.hide();
                            const artPentruCerere:TProductBasketMarkedFavorites={
                                appid:'0',
                                productPid:response.productPid,
                                categoryPid: response.categoryPid,
                                productCode:response.productCode,
                                productNameRO: response.productNameRO,
                                productNameEN: response.productNameEN,
                                productNameBG: response.productNameBG,
                                categoryName: '',
                                qBuc: vueInst.nrBucati,
                                q_um_base: vueInst.qUm1,
                                qUm1 :vueInst.qUm1,
                                qUm2: vueInst.qUm2,
                                um1: response.um1,
                                um2: response.um2,
                                um1_to_um2 : response.um1ToUm2,
                                l: vueInst.selectedLength,
                                w:vueInst.selectedWidth,
                                t:vueInst.selectedThickness,
                                d:vueInst.selectedDiameter,
                                h:vueInst.selectedHeight,
                                a:vueInst.selectedAlloy,
                                k:vueInst.selectedType,
                                g:vueInst.selectedRollWeight,
                                dorescDebitare:vueInst.dorescDebitare,
                                cuttingLength:vueInst.cuttingLength,
                                cuttingWidth:vueInst.cuttingWidth,
                                enumPlacaBara:response.enumPlacaBara,
                                densitate:response.densitate,
                                isInFavorite:vueInst.storeFavorites.favorites.some(favorite=>{return favorite.productCode==response.productCode}),
                                observatii:latinize(vueInst.inputFreeTextComments),
                                nr_ord:0,
                                tip_um: vueInst.tip_um
                            }
                            vueInst.EventBusStore.set_event({name:'eventPutArticleInCerere',params:{ artPentruCerere: JSON.stringify(artPentruCerere)}});
                        }
                    }).catch((error) => {
                    vueInst.$q.loading.hide();
                    vueInst.$q.notify({
                        color: 'red',
                        textColor: 'white',
                        type: 'negative',
                        icon: 'error',
                        position: 'top',
                        timeout: 3000,
                        message: error.toString()
                    })
                });

            }
        }
    }

    get existaArticole():boolean{
        if(this.paramArticles.arrSizes && this.paramArticles.arrSizes.length>0){
            return true;
        }
        else{
            return false;
        }
    }


    get articleCouldBePutInBasket():boolean{
        let lengthIsOk=this.paramArticles.withLength=='n'||false;
        let widthIsOk=this.paramArticles.withWidth=='n'||false;
        let thicknessIsOk=this.paramArticles.withThickness=='n'||false;
        let diameterIsOk=this.paramArticles.withDiameter=='n'||false;
        let heightIsOk=this.paramArticles.withHeight=='n'||false;
        let alloyIsOk=this.paramArticles.withAlloy=='n'||false;
        let typeIsOk=this.paramArticles.withType=='n'||false;
        let rollWeightIsOk=this.paramArticles.withRollWeight=='n'||false;
        if(this.paramArticles.withLength=='y' && this.selectedLength){lengthIsOk=true;}
        if(this.paramArticles.withWidth=='y' && this.selectedWidth){widthIsOk=true;}
        if(this.paramArticles.withThickness=='y' && this.selectedThickness){thicknessIsOk=true;}
        if(this.paramArticles.withDiameter=='y' && this.selectedDiameter){diameterIsOk=true;}
        if(this.paramArticles.withHeight=='y' && this.selectedHeight){heightIsOk=true;}
        if(this.paramArticles.withAlloy=='y' && this.selectedAlloy){alloyIsOk=true;}
        if(this.paramArticles.withType=='y' && this.selectedType){typeIsOk=true;}
        if(this.paramArticles.withRollWeight=='y' && this.selectedRollWeight){rollWeightIsOk=true;}
        return (lengthIsOk && widthIsOk && thicknessIsOk && diameterIsOk && heightIsOk && alloyIsOk && typeIsOk && rollWeightIsOk && this.qUm1>0) || this.inputFreeTextComments.length>3;
    }

    get clientWasSomethingElse():boolean{
        let lengthIsOk=this.paramArticles.withLength=='n'||false;
        let widthIsOk=this.paramArticles.withWidth=='n'||false;
        let thicknessIsOk=this.paramArticles.withThickness=='n'||false;
        let diameterIsOk=this.paramArticles.withDiameter=='n'||false;
        let heightIsOk=this.paramArticles.withHeight=='n'||false;
        let alloyIsOk=this.paramArticles.withAlloy=='n'||false;
        let typeIsOk=this.paramArticles.withType=='n'||false;
        let rollWeightIsOk=this.paramArticles.withRollWeight=='n'||false;
        if(this.paramArticles.withLength=='y' && this.selectedLength){lengthIsOk=true;}
        if(this.paramArticles.withWidth=='y' && this.selectedWidth){widthIsOk=true;}
        if(this.paramArticles.withThickness=='y' && this.selectedThickness){thicknessIsOk=true;}
        if(this.paramArticles.withDiameter=='y' && this.selectedDiameter){diameterIsOk=true;}
        if(this.paramArticles.withHeight=='y' && this.selectedHeight){heightIsOk=true;}
        if(this.paramArticles.withAlloy=='y' && this.selectedAlloy){alloyIsOk=true;}
        if(this.paramArticles.withType=='y' && this.selectedType){typeIsOk=true;}
        if(this.paramArticles.withRollWeight=='y' && this.selectedRollWeight){rollWeightIsOk=true;}
        return lengthIsOk && widthIsOk && thicknessIsOk && diameterIsOk && heightIsOk && alloyIsOk && typeIsOk && rollWeightIsOk && this.nrBucati>0 || this.inputFreeTextComments.length>3;
    }

    get articleCouldBePutInFavorites():boolean{
        let lengthIsOk=this.paramArticles.withLength=='n'||false;
        let widthIsOk=this.paramArticles.withWidth=='n'||false;
        let thicknessIsOk=this.paramArticles.withThickness=='n'||false;
        let diameterIsOk=this.paramArticles.withDiameter=='n'||false;
        let heightIsOk=this.paramArticles.withHeight=='n'||false;
        let alloyIsOk=this.paramArticles.withAlloy=='n'||false;
        let typeIsOk=this.paramArticles.withType=='n'||false;
        let rollWeightIsOk=this.paramArticles.withRollWeight=='n'||false;
        if(this.paramArticles.withLength=='y' && this.selectedLength){lengthIsOk=true;}
        if(this.paramArticles.withWidth=='y' && this.selectedWidth){widthIsOk=true;}
        if(this.paramArticles.withThickness=='y' && this.selectedThickness){thicknessIsOk=true;}
        if(this.paramArticles.withDiameter=='y' && this.selectedDiameter){diameterIsOk=true;}
        if(this.paramArticles.withHeight=='y' && this.selectedHeight){heightIsOk=true;}
        if(this.paramArticles.withAlloy=='y' && this.selectedAlloy){alloyIsOk=true;}
        if(this.paramArticles.withType=='y' && this.selectedType){typeIsOk=true;}
        if(this.paramArticles.withRollWeight=='y' && this.selectedRollWeight){rollWeightIsOk=true;}
        return lengthIsOk && widthIsOk && thicknessIsOk && diameterIsOk && heightIsOk && alloyIsOk && typeIsOk && rollWeightIsOk;
    }

    get articleIsOnFavorites():boolean{
        const vueInst=this;
        const articleFavorite=vueInst.storeFavorites.favorites.find(favorite=> {
            let lengthIsTheSame = false;
            let widthIsTheSame = false;
            let thicknessIsTheSame = false;
            let diameterIsTheSame = false;
            let heightIsTheSame = false;
            let alloyIsTheSame = false;
            let typeIsTheSame = false;
            let rollWeightIsTheSame = false;
            const categoryIsTheSame= (favorite.categoryPid.toString()==vueInst.paramArticles.categoryPid.toString());
            if (vueInst.paramArticles.withLength == 'y') {
                    if (vueInst.selectedLength && vueInst.selectedLength == favorite.l) {lengthIsTheSame = true;} else {lengthIsTheSame = false;}
                } else {lengthIsTheSame = true;}
            if (vueInst.paramArticles.withWidth == 'y') {
                if (vueInst.selectedWidth && vueInst.selectedWidth == favorite.w) {widthIsTheSame = true;} else {widthIsTheSame = false;}
            } else {widthIsTheSame = true;}
            if (vueInst.paramArticles.withThickness == 'y') {
                if (vueInst.selectedThickness && vueInst.selectedThickness == favorite.t) {thicknessIsTheSame = true;} else {thicknessIsTheSame = false;}
            } else {thicknessIsTheSame = true;}
            if (vueInst.paramArticles.withDiameter == 'y') {
                if (vueInst.selectedDiameter && vueInst.selectedDiameter == favorite.d) {diameterIsTheSame = true;} else {diameterIsTheSame = false;}
            } else {diameterIsTheSame = true;}
            if (vueInst.paramArticles.withHeight == 'y') {
                if (vueInst.selectedHeight && vueInst.selectedHeight == favorite.h) {heightIsTheSame = true;} else {heightIsTheSame = false;}
            } else {heightIsTheSame = true;}
            if (vueInst.paramArticles.withAlloy == 'y') {
                if (vueInst.selectedAlloy && vueInst.selectedAlloy == favorite.a) {alloyIsTheSame = true;} else {alloyIsTheSame = false;}
            } else {alloyIsTheSame = true;}
            if (vueInst.paramArticles.withType == 'y') {
                if (vueInst.selectedType && vueInst.selectedType == favorite.k) {typeIsTheSame = true;} else {typeIsTheSame = false;}
            } else {typeIsTheSame = true;}
            if (vueInst.paramArticles.withRollWeight == 'y') {
                if (vueInst.selectedRollWeight && vueInst.selectedRollWeight == favorite.g) {rollWeightIsTheSame = true;} else {rollWeightIsTheSame = false;}
            } else {rollWeightIsTheSame = true;}
            return categoryIsTheSame && lengthIsTheSame && widthIsTheSame && thicknessIsTheSame && diameterIsTheSame && heightIsTheSame && alloyIsTheSame && typeIsTheSame && rollWeightIsTheSame;
        });
        if(articleFavorite){return true;}else{return false;}
    }

    public getDetailsArticleFromDB(): void {
        const vueInst=this;
        vueInst.pid = vueInst.productPid;
        ServiceProduct.getArticleFromDB(vueInst.productPid).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                console.log('getDetailsArticleFromDB=%o',response)
               if(response.product.l){vueInst.setSize('l',response.product.l)}
                if(response.product.w){vueInst.setSize('w',response.product.w)}
                if(response.product.t){vueInst.setSize('t',response.product.t)}
                if(response.product.d){vueInst.setSize('d',response.product.d)}
                if(response.product.h){vueInst.setSize('h',response.product.h)}
                if(response.product.a){vueInst.setSize('a',response.product.a)}
                if(response.product.k){vueInst.setSize('k',response.product.k)}
                if(response.product.g){vueInst.setSize('g',response.product.g)}
            }
        })
    }

    public coreleazaUm1Um2(umModificat:string): void {
        const vueInst=this;
        // console.log('coreleaza um1 um2 ' + umModificat);
       if(umModificat=='um1'){
           vueInst.qUm2=Number((vueInst.qUm1*1/vueInst.selectedSize.um1_to_um2).toFixed(2));
       }else{
           if(umModificat=='um2') {
               vueInst.qUm1=Number((vueInst.qUm2*1*vueInst.selectedSize.um1_to_um2).toFixed(2));
           }
       }

        if(vueInst.stocArticol > vueInst.qUm1) {
            vueInst.labelStock = this.$t('message.in_stock');
        } else {
            vueInst.labelStock = this.$t('message.limited_stock');
        }
    }

    public punePeZeroDimensiuni(): void {
        this.qUm1=0;
        this.qUm2=0;
        if(this.dorescDebitare) {
            this.selectedUM1 = true;
            this.selectedUM2 = true;
            this.tip_um = 'um12';
        }
    }

    public get ErrorRuleLengthDebitarePlaca():boolean {
        
        // console.log('error rule: ' + this.cuttingLength + ' ' + this.typeOfArticle);
        if(this.cuttingLength) {
            if (this.typeOfArticle == 'placa') {
                if(Number(this.cuttingLength) < this.minLengthPlaci) {
                    this.msjErrorRuleCuttingLength = this.$t('message.length_smaller_than') + ' ' + this.minLengthPlaci + 'mm';
                    return true;
                } else if(Number(this.cuttingLength) > this.maxLengthPlaci) {
                    this.msjErrorRuleCuttingLength = this.$t('message.length_smaller_than') + ' ' + this.maxLengthPlaci + 'mm';
                    return true;
                } 
            } else {
                if(Number(this.cuttingLength) < this.minLengthBare) {
                    this.msjErrorRuleCuttingLength = this.$t('message.length_smaller_than') + ' ' + this.minLengthBare + 'mm';
                    return true;
                } else if(Number(this.cuttingLength) > this.maxLengthBare) {
                    this.msjErrorRuleCuttingLength = this.$t('message.length_smaller_than') + ' ' + this.maxLengthBare + 'mm';
                    return true;
                }
            }
        }
        return false;
    }

    public get ErrorRuleWidthDebitarePlaca():boolean{
        if(this.cuttingWidth){
            if (Number(this.cuttingWidth)<this.minLengthPlaci) {
                this.msjErrorRuleCuttingWidth= this.$t('message.width_smaller_than') + ' ' + this.minLengthPlaci + 'mm';
                return true;
            } else if(Number(this.cuttingWidth) > this.maxLengthPlaci){
                this.msjErrorRuleCuttingWidth= this.$t('message.width_bigger_than') + ' ' + this.maxLengthPlaci + 'mm';
                return true;
            }
        }
        return false;
    }

    public get ErrorRuleIntegerNumberBuc(): boolean {
        if(this.selectedSize.um2 == 'BUC') {
            return !Number.isInteger(this.qUm2);
        }
        return false;
    }

    public coreleazaUm1Um2CuDebitare(): void {
        const vueInst=this;
        let qML=0;
        let qKg=0;
        if(vueInst.typeOfArticle==='bara') {
            // eslint-disable-next-line no-debugger
            //debugger;
            qML= (vueInst.cuttingLength*vueInst.nrBucati)/1000;
            qKg=Number((qML*1*vueInst.selectedSize.um1_to_um2).toFixed(2));
            if(vueInst.selectedSize.um1==='KG'){
                vueInst.qUm1=qKg;
            }

            if(vueInst.selectedSize.um2==='ML'){
                vueInst.qUm2=qML;
            }
        }
        if(vueInst.typeOfArticle==='placa'){
            let kg_per_buc=0;
            if(vueInst.densitate && vueInst.selectedThickness && vueInst.typeOfArticle==='placa'){
                kg_per_buc = Math.round(((vueInst.cuttingLength*vueInst.cuttingWidth*vueInst.selectedThickness/1000000)*vueInst.densitate + Number.EPSILON) * 100) / 100

                console.log('coreleaza um1 um2 cu debitare ' + kg_per_buc + ' ' + qML + ' ' + qKg);
                if(vueInst.selectedSize.um1==='BUC' || vueInst.selectedSize.um1==='БРОЙ') {
                    vueInst.qUm1 = vueInst.nrBucati;
                    vueInst.qUm2=Number((kg_per_buc*vueInst.qUm1).toFixed(2));
                }
                if(vueInst.selectedSize.um2==='BUC' || vueInst.selectedSize.um2==='БРОЙ') {
                    vueInst.qUm2 = vueInst.nrBucati;
                    vueInst.qUm1=Number((kg_per_buc*vueInst.qUm2).toFixed(2));
                }
            }
        }

        if(vueInst.stocArticol > vueInst.qUm1) {
            vueInst.labelStock = this.$t('message.in_stock');
        } else {
            vueInst.labelStock = this.$t('message.limited_stock');
        }

       // $this->kg_total=$this->kg_per_buc*$this->buc;

    }

    public calculDimensiuniDebitare(): void {
        console.log('calculDimensiuniDebitare')
        const vueInst=this;
        if(vueInst.productCode) {
            ServiceBrowseArticles.calculDimensiuniDebitare(vueInst.productCode, vueInst.cuttingLength, vueInst.nrBucati).then(response => {
                vueInst.$q.loading.hide();
                if (response.status == 'success') {
                    console.log('getDetailsArticleFromDB=%o', response)
                    if (response.q_um1) {
                        vueInst.qUm1=response.q_um1;
                    }
                    if (response.q_um2) {
                        vueInst.qUm2=response.q_um2;
                    }
                }
            })
        }
    }

    public get minLengthPlaci():number {
        return this.storeNomenclatoare.minLengthPlaci;
    }

    public get minLengthBare():number {
        if(this.pid == '36' || this.pid == '56' || this.pid == '8' || this.pid == '7'){
            return 10;
        }
        return this.storeNomenclatoare.minLengthBare;
    }

    public get maxLengthPlaci():number {
        return this.storeNomenclatoare.maxLengthPlaci;
    }

    public get maxLengthBare():number {
        return this.storeNomenclatoare.maxLengthBare;
    }

    public get labelBtnAdaugaBasket():string{
        let result= 'Adauga in cos';
        if(this.typeOfAccess === 'fromDashboard' ){
            result = 'Adauga in cos';
        }
        if(this.typeOfAccess === 'fromCerere' || this.typeOfAccess === 'fromOferta' ){
            result = 'Adauga in cerere';
        }
        return result;
    }

    public resetVariables(): void {
        const vueInst=this;
        vueInst.nrBucati=0;
        vueInst.cuttingLength=0;
        vueInst.cuttingWidth=0;
        vueInst.dorescDebitare=false;
        vueInst.qUm1=0;
        vueInst.qUm2=0;
        vueInst.selectedLength = null;
        vueInst.selectedWidth = null;
        vueInst.selectedThickness = null;
        vueInst.selectedDiameter = null;
        vueInst.selectedHeight = null;
        vueInst.selectedAlloy = null;
        vueInst.selectedType = null;
        vueInst.selectedRollWeight = null;
        vueInst.isPlacaAluminiu = '0';
        vueInst.typeOfArticle=TEnumPlacaBara.others;
        vueInst.inputFreeTextComments = '';
        vueInst.initializeSelectedSize();
        vueInst.selectedUM1 = true;
        vueInst.selectedUM2 = true;
        vueInst.tip_um = 'um12';
        vueInst.loadingStock = false;
        vueInst.labelStock = vueInst.$t('message.check_stock');

        this.paramArticles= {
            status: '',
            message: '',
            arrLength: [],
            arrWidth: [],
            arrThickness: [],
            arrDiameter: [],
            arrHeight: [],
            arrAlloy: [],
            arrType: [],
            arrRollWeight: [],
            categoryName: '',
            categoryPid: 0,
            isParentForArticles: '',
            withDiameter: 'n',
            withLength: 'n',
            withThickness: 'n',
            withWidth: 'n',
            withHeight: 'n',
            withAlloy: 'n',
            withType: 'n',
            withRollWeight: 'n',
            positionLength: 0,
            positionWidth: 0,
            positionThickness: 0,
            positionDiameter: 0,
            positionHeight: 0,
            positionAlloy: 0,
            positionType:0,
            positionRollWeight: 0,
            arrSizes: [],
            hierarchicalChain:[]
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    setSingleSelectionIfAvailable(){
        const vueInst=this;

        // console.log(vueInst.paramArticles);

        if(vueInst.paramArticles.arrAlloy.length == 1) {
            // vueInst.selectedAlloy = vueInst.paramArticles.arrAlloy[0];
            vueInst.setSize('a', vueInst.paramArticles.arrAlloy[0]);
        }
        if(vueInst.paramArticles.arrDiameter.length == 1) {
            // vueInst.selectedDiameter = vueInst.paramArticles.arrDiameter[0];
            vueInst.setSize('d', vueInst.paramArticles.arrDiameter[0]);
        }
        if(vueInst.paramArticles.arrHeight.length == 1) {
            // vueInst.selectedHeight = vueInst.paramArticles.arrHeight[0];
            vueInst.setSize('h', vueInst.paramArticles.arrHeight[0]);
        }
        if(vueInst.paramArticles.arrRollWeight.length == 1) {
            // vueInst.selectedRollWeight = vueInst.paramArticles.arrRollWeight[0];
            vueInst.setSize('g', vueInst.paramArticles.arrRollWeight[0]);
        }
        if(vueInst.paramArticles.arrLength.length == 1) {
            // vueInst.selectedLength = vueInst.paramArticles.arrLength[0];
            vueInst.setSize('l', vueInst.paramArticles.arrLength[0]);
            // console.log(vueInst.paramArticles.arrLength);
        }
        if(vueInst.paramArticles.arrType.length == 1) {
            // vueInst.selectedType = vueInst.paramArticles.arrType[0];
            vueInst.setSize('k', vueInst.paramArticles.arrType[0]);
        }
        if(vueInst.paramArticles.arrWidth.length == 1) {
            // vueInst.selectedWidth = vueInst.paramArticles.arrWidth[0];
            vueInst.setSize('w', vueInst.paramArticles.arrWidth[0]);
        }
        if(vueInst.paramArticles.arrThickness.length == 1) {
            // vueInst.selectedThickness = vueInst.paramArticles.arrThickness[0];
            vueInst.setSize('t', vueInst.paramArticles.arrThickness[0]);
        }

    }

    getData(newVal: string): void {
        const vueInst=this;
        ServiceBrowseArticles.getDetailsArticlesFromDB(newVal).then(response=>{
            if(response.status=='success'){
                vueInst.qUm1=0;
                vueInst.qUm2=0;
                vueInst.initializeSelectedSize();
                vueInst.paramArticles=JSON.parse(JSON.stringify(response))
                vueInst.possibleSizes=JSON.parse(JSON.stringify(response.arrSizes))
                if(vueInst.productPid && vueInst.productPid!='0'){
                    vueInst.$q.loading.show();
                    vueInst.getDetailsArticleFromDB();
                }else{
                    vueInst.$q.loading.hide();
                    vueInst.setSingleSelectionIfAvailable();
                }
            }
        })
    }


    @Watch('pidCategory', { immediate: true, deep: false })
    onPidCategoryChanged(newVal: string): void {
        console.log('Watch onPidCategoryChanged')
        const vueInst=this;
        vueInst.resetVariables();
        vueInst.$q.loading.show();
        vueInst.pid = newVal;
        if(newVal.includes('{')) {
            newVal = parsePostgresArray(newVal)[0];
        }
        vueInst.getData(newVal);
    }

    public isOpenDialogCategory=false;
    public labelTitle = '';
    public ImgCategoryString641='';
    public ImgCategoryString642='';
    public ImgCategoryString643='';

    showTipImages(pid_category: number, index: number, size_type: string): void {
        const vueInst=this;
        vueInst.labelTitle = size_type;
        vueInst.isOpenDialogCategory=true;
        ServiceAdminNomCategory.getImagesCategoryAsStringTip(pid_category + '_' + index).then((response:any)=>{
            //console.log('getImageCategoryAsString with response=%o',response)
            vueInst.ImgCategoryString641=response.image1;
            vueInst.ImgCategoryString642=response.image2;
            vueInst.ImgCategoryString643=response.image3;
        })
    }

    public activated(): void {
        const vueInst=this;
        console.log('activated');
        vueInst.userStore.set_page_transition('fade-in-right');
        if(vueInst.$q.platform.is.mobile) {
            vueInst.userStore.set_showbackbar(true);
            vueInst.userStore.set_title_back_bar(vueInst.$t('message.item_details'));
        }
        if(vueInst.$q.platform.is.mobile){
            vueInst.dialogTransitionShow ='slide-left';
            vueInst.dialogTransitionHide ='slide-right';
        }else{
            vueInst.dialogTransitionShow ='slide-right';
            vueInst.dialogTransitionHide ='slide-left';
        }
        // vueInst.onPidCategoryChanged(vueInst.pid, vueInst.pid);
        
        // vueInst.getData(vueInst.pid);
    }
}
