import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceProduct} from "@/services/ServiceProduct";
import {getModule} from "vuex-module-decorators";
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import {TProductBasket} from '@/types/TProductBasket';
import {TEnumPlacaBara} from '@/types/TEnumPlacaBara';
import HierarchicalChainBrowseHeader from '@/components/HierarchicalChainBrowseHeader/HierarchicalChainBrowseHeader.vue'
import {ArticolNullInBasket, CONFIG_ENV} from "@/config";

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


@Options({
    name: "EditQuantityArticleCerere",
    components: {HierarchicalChainBrowseHeader}
})
export default class EditQuantityArticleCerere extends Vue {
[x: string]: any;
    @Prop({ item: ArticolNullInBasket }) public readonly item!: TProductBasket;
    @Prop() public readonly index!: number;
    @Prop() public onEditItem!: (item:TProductBasket, index:number)=>void;

    public productNameRO='';
    public productNameEN='';
    public productNameBG='';
    public nrBucati = 0;
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
    public dorescDebitare = false;
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
    public storeNomenclatoare = getModule(nomenclatoare);

    public selectedUM1 = true;
    public selectedUM2 = true;
    public tip_um = 'um12';
    public inputFreeTextComments='';

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


    get ArticolIdentificatInBazaDate():boolean{
        if(this.productCode && this.productCode.length>0){
            return true;
        }
        else{
            return false;
        }
    }

    public getDetailsArticleFromDB(): void {
        const vueInst=this;
        //ServiceProduct.getArticleByProductCode
        ServiceProduct.getArticleFromDB(vueInst.item.productPid).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                console.log('getDetailsArticleFromDB=%o',response)
                vueInst.productCode=response.product.productCode;
                vueInst.productNameRO=response.product.productNameRO;
                vueInst.productNameEN=response.product.productNameEN;
                vueInst.productNameBG=response.product.productNameBG;

                vueInst.selectedLength =response.product.l;
                vueInst.selectedWidth = response.product.w;
                vueInst.selectedThickness = response.product.t;
                vueInst.selectedDiameter = response.product.d;
                vueInst.selectedHeight = response.product.h;
                vueInst.selectedAlloy = response.product.a;
                vueInst.selectedType = response.product.k;
                vueInst.selectedRollWeight = response.product.w;
                vueInst.selectedUm1 = response.product.um1;
                vueInst.selectedUm2 = response.product.um2;
                vueInst.selectedUm1ToUm2 = response.product.um1_to_um2;

                vueInst.selectedSize.l=(response.product.l?response.product.l:0);
                vueInst.selectedSize.w=(response.product.w?response.product.w:0);
                vueInst.selectedSize.t=(response.product.t?response.product.t:0);
                vueInst.selectedSize.d=(response.product.d?response.product.d:0);
                vueInst.selectedSize.h=(response.product.h?response.product.h:0);
                vueInst.selectedSize.a=(response.product.a?response.product.a:'');
                vueInst.selectedSize.k=(response.product.k?response.product.k:'');
                vueInst.selectedSize.g=(response.product.g?response.product.g:0);
                vueInst.selectedSize.um1=(response.product.um1?response.product.um1:'');
                vueInst.selectedSize.um2=(response.product.um2?response.product.um2:'');
                vueInst.selectedSize.um1_to_um2=(response.product.um1_to_um2?response.product.um1_to_um2:1);
                vueInst.typeOfArticle=response.product.enumPlacaBara;
                vueInst.densitate=response.product.densitate;
                vueInst.selectedSize.cuDebitare = response.product.dorescDebitare;
            }
        })
    }

    public coreleazaUm1Um2(umModificat:string): void {
        const vueInst=this;
        // console.log('coreleaza um1 um2 ' + umModificat);
        if(umModificat=='um1'){
            vueInst.qUm2=Number((vueInst.qUm1*1/vueInst.selectedSize.um1_to_um2).toFixed(2));
        }else{
            if(umModificat=='um2'){
                vueInst.qUm1=Number((vueInst.qUm2*1*vueInst.selectedSize.um1_to_um2).toFixed(2));
            }
        }
    }

    public punePeZeroDimensiuni(): void {
        this.qUm1=0;
        this.qUm2=0;
    }

    public get ErrorRuleLengthDebitarePlaca():boolean{
        if(this.cuttingLength && Number(this.cuttingLength)<50){
            this.msjErrorRuleCuttingLength = this.$t('message.length_smaller_than') + ' 50mm';
            return true;
        }
        else{
            return false;
        }
    }


    public get ErrorRuleWidthDebitarePlaca():boolean{
        if(this.cuttingWidth && Number(this.cuttingWidth)<50){
            this.msjErrorRuleCuttingWidth= this.$t('message.width_smaller_than') + ' 50mm';
            return true;
        }
        else{
            return false;
        }
    }

    public coreleazaUm1Um2CuDebitare(): void {
        const vueInst=this;
        let qML=0;
        let qKg=0;
        if(vueInst.typeOfArticle==='bara') {
            // eslint-disable-next-line no-debugger
            // debugger;
            qML= (vueInst.cuttingLength*vueInst.nrBucati)/1000;
            qKg=Number((qML*1*vueInst.selectedSize.um1_to_um2).toFixed(2));
            // console.log('coreleaza um1 um2 cu debitare ' + qKg + ' ' + qML + ' ' + qBuc);
            if(vueInst.selectedSize.um1==='KG'){
                vueInst.qUm1=qKg;
            }

            if(vueInst.selectedSize.um2==='ML'){
                vueInst.qUm2=qML;
            }
        }
        if(vueInst.typeOfArticle==='placa'){
            let kg_per_buc=0;
            // console.log('coreleaza um1 um2 cu debitare placa ' + vueInst.densitate + ' ' + vueInst.selectedThickness + ' ' + vueInst.typeOfArticle);

            if(vueInst.densitate && vueInst.selectedThickness && vueInst.typeOfArticle==='placa'){
                kg_per_buc = Math.round(((vueInst.cuttingLength*vueInst.cuttingWidth*vueInst.selectedThickness/1000000)*vueInst.densitate + Number.EPSILON) * 100) / 100
                // console.log('coreleaza um1 um2 cu debitare ' + kg_per_buc + ' ' + qML + ' ' + qBuc);

                if(vueInst.selectedSize.um1==='BUC') {
                    vueInst.qUm1 = vueInst.nrBucati;
                    vueInst.qUm2=Number((kg_per_buc*vueInst.qUm1).toFixed(2));
                }
                if(vueInst.selectedSize.um2==='BUC') {
                    vueInst.qUm2 = vueInst.nrBucati;
                    vueInst.qUm1=Number((kg_per_buc*vueInst.qUm2).toFixed(2));
                }
            }
        }


        // $this->kg_total=$this->kg_per_buc*$this->buc;

    }


    public get minLengthPlaci():number {
        return this.storeNomenclatoare.minLengthPlaci;
    }

    public get minLengthBare():number {
        return this.storeNomenclatoare.minLengthBare;
    }

    public get maxLengthPlaci():number {
        return this.storeNomenclatoare.maxLengthPlaci;
    }

    public get maxLengthBare():number {
        return this.storeNomenclatoare.maxLengthBare;
    }

    public resetVariables(): void {
        const vueInst=this;
        vueInst.productCode=null;
        vueInst.nrBucati=0;
        vueInst.cuttingLength=0;
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
        vueInst.selectedUM1 = true;
        vueInst.selectedUM2 = true;
        vueInst.tip_um = 'um12';
        vueInst.typeOfArticle=TEnumPlacaBara.others;
        vueInst.initializeSelectedSize();
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
    
    public editProductInOffer(): void {
        const vueInst=this;
        const editedItem={...vueInst.item, qUm1:vueInst.qUm1, qUm2:vueInst.qUm2,dorescDebitare:vueInst.dorescDebitare,qBuc: vueInst.nrBucati,cuttingLength:vueInst.cuttingLength, cuttingWidth:vueInst.cuttingWidth, tip_um:vueInst.tip_um, observatii:vueInst.inputFreeTextComments}

        // console.log('editProductInOffer editedItem=%o',editedItem);
        vueInst.onEditItem(editedItem,vueInst.index);
    }

     public created(): void {
        //  console.log('created EditQuantityArticleCerere withm prop item=%o', this.item);
        //  console.log('created EditQuantityArticleCerere withm prop index=%o', this.index);
         const vueInst=this;
         vueInst.resetVariables();
         vueInst.nrBucati =vueInst.item.qBuc;
         vueInst.cuttingLength = (vueInst.item.cuttingLength?vueInst.item.cuttingLength:0);
         vueInst.cuttingWidth = (vueInst.item.cuttingWidth?vueInst.item.cuttingWidth:0);
         vueInst.dorescDebitare = (vueInst.item.dorescDebitare? true: false);
         vueInst.selectedSize.cuDebitare= (vueInst.item.dorescDebitare? true: false);
         vueInst.qUm1 = (vueInst.item.qUm1?vueInst.item.qUm1:0);
         vueInst.qUm2 = (vueInst.item.qUm2?vueInst.item.qUm2:0);
         vueInst.selectedUm1 = vueInst.item.um1;
         vueInst.selectedUm2 = vueInst.item.um2;
         vueInst.tip_um = vueInst.item.tip_um;
         vueInst.selectedUM1 = vueInst.tip_um == 'um12' || vueInst.tip_um == 'um1';
         vueInst.selectedUM2 = vueInst.tip_um == 'um12' || vueInst.tip_um == 'um2';
         vueInst.inputFreeTextComments=vueInst.item.observatii;

/*

         vueInst.densitate :number|null = 0;
         vueInst.typeOfArticle :TEnumPlacaBara=TEnumPlacaBara.others;


         vueInst.selectedLength: number|null = null;
         vueInst.selectedWidth: number|null = null;
         vueInst.selectedThickness: number|null = null;
         vueInst.selectedDiameter: number|null = null;
         vueInst.selectedHeight: number|null = null;
         vueInst.selectedAlloy: string|null = null;
         vueInst.selectedType: string|null = null;
         vueInst.selectedRollWeight: number|null = null;
         vueInst.selectedUm1: string|null = null;
         vueInst.selectedUm2: string|null = null;
         vueInst.selectedUm1ToUm2: number|null = null;
         vueInst.dorescDebitare = false;
*/
         vueInst.getDetailsArticleFromDB();
     }


}
