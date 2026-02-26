import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServiceAdminNomCategory} from '@/services/ServiceAdminNomCategory'
import {ServiceAdminNomProducts} from '@/services/ServiceAdminNomProducts'
import {TArticle} from "@/types/TArticle";
import {TOptionCategory} from "@/types/TOptionCategory";
import {EnumUM} from "@/types/EnumUM";
import { parsePostgresArray } from '@/modules/utils';

type TArticleStr = {
    appid:string;
    pid:string;
    categoryPid:string;
    lantHierarchyCategories: TOptionCategory[];
    code: string;
    name_ro:string;
    name_en:string;
    name_bg:string;
    UMBase:string;
    um1: string;
    um2: string;
    um1ToUm2: number;
    isActive:string;
    withLength: string;
    withWidth: string;
    withThickness: string;
    withDiameter: string;
    withHeight: string;
    withAlloy: string;
    withType: string;
    sizeLength:number|null;
    sizeWidth:number|null;
    sizeThickness:number|null;
    sizeDiameter:number|null;
    sizeHeight:number|null;
    sizeAlloy: string|null;
    sizeType: string|null;
}

@Options({
    name: "EditArticle",
    components: {}
})
export default class EditArticle extends Vue {
    @Prop({ default: '0' }) public readonly pid!: string|null;
    //@Prop() public fnOnSaveData!: (userid:string)=>void;
    @Prop() public closeHandler!: (needRefresh:boolean)=>void;
    public ajaxLoadingData=true;
    public storeNomenclatoare = getModule(nomenclatoare);
    public article:TArticle={
                                appid:'',
                                pid:'',
                                categoryPid:'',
                                categories:[],
                                code: '',
                                name_ro:'',
                                name_en:'',
                                name_bg:'',
                                UMBase:'',
                                um1:'',
                                um2: '',
                                um1ToUm2: 1,
                                isActive:false,
                                withLength: false,
                                withWidth: false,
                                withThickness: false,
                                withDiameter: false,
                                withHeight: false,
                                withAlloy: false,
                                withType: false,
                                sizeLength:0,
                                sizeWidth:0,
                                sizeThickness:0,
                                sizeDiameter:0,
                                sizeHeight:0,
                                sizeAlloy:'',
                                sizeType:''
                            };
    public urlUserImgProfileByAppid = '';
    declare public $refs: any;
    public filteredOptionsCategories:TOptionCategory[]=[];
    public userStore = getModule(user);
    public nomenclatoareStore = getModule(nomenclatoare);
    public categoryToAdd:TOptionCategory = {
        pid: '',
        name_ro: '',
        name_en: '',
        name_bg: '',
        categories: [] as TOptionCategory[],
        withLength: '',
        withWidth: '',
        withThickness: '',
        withDiameter: '',
        withHeight: '',
        withAlloy: '',
        withType: '',
        lantHierarchyCategoriesRO: '',
        lantHierarchyCategoriesEN: '',
        lantHierarchyCategoriesBG: ''
    }

    public goToView(pRouteViewName: string ) : void  {
        this.$router.push({ name: pRouteViewName })
    }

    get optionsUM(): EnumUM[] {
        return this.storeNomenclatoare.optionsUM;
    }

    public onSubmit() : void {
        const vueInst=this;
        //alert('de discutat, nu stiu daca ar trebui sa modifice ceva in portaL, poate trebuie sa vina totul din Sales?!')

        vueInst.$q.loading.show()
        vueInst.article.categoryPid = '{' + vueInst.article.categories.map(categ => categ.pid).join(',') + '}';
        ServiceAdminNomProducts.postProduct(vueInst.article).then(response=>{
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                vueInst.closeHandler(true);
            }
        });

    }

    getCategoryDetailsAndSetSizes(pCategoryPid:string) : void {
        const vueInst=this;
        vueInst.resetCategoryToAdd();
        if(vueInst.article.categories.some(categ => categ.pid == pCategoryPid)){
            vueInst.$q.notify({
                color: 'teal',
                textColor: 'white',
                icon: 'positive',
                position: 'top',
                timeout: 500,
                message: vueInst.$t('message.category_already_selected')
            });
            return;
        }
        // console.log('getCategoryDetailsAndSetSizes=%o',pCategoryPid);
        const pCategory=vueInst.optionsCategories.find(category=>{
            return category.pid==pCategoryPid;
        })
        // console.log('getCategoryDetailsAndSetSizes pCategory=%o',pCategory)
        if(pCategory) {
            vueInst.article.categories.push(pCategory);

            // vueInst.article.um1 = '';
            // vueInst.article.um2 = '';
            // vueInst.article.um1ToUm2 = 1;

            // vueInst.article.sizeLength = null;
            // vueInst.article.sizeWidth = null;
            // vueInst.article.sizeThickness = null;
            // vueInst.article.sizeDiameter = null;
            // vueInst.article.sizeHeight = null;
            // vueInst.article.sizeAlloy = null;
            // vueInst.article.sizeType = null;

            vueInst.article.withLength = (pCategory.withLength == 'y' ? true : false);
            vueInst.article.withWidth = (pCategory.withWidth == 'y' ? true : false);
            vueInst.article.withThickness = (pCategory.withThickness == 'y' ? true : false);
            vueInst.article.withDiameter = (pCategory.withDiameter == 'y' ? true : false);
            vueInst.article.withHeight = (pCategory.withHeight == 'y' ? true : false);
            vueInst.article.withAlloy = (pCategory.withAlloy == 'y' ? true : false);
            vueInst.article.withType = (pCategory.withType == 'y' ? true : false);
        }
    }

    replaceCategoryDetailsAndSetSizes(pCategoryPid:string, index: number): void {
        const vueInst=this;

        const pCategory=vueInst.optionsCategories.find(category=>{
            return category.pid==pCategoryPid;
        });

        if(pCategory) {

            vueInst.article.categories[index] = pCategory;

            // vueInst.article.um1 = '';
            // vueInst.article.um2 = '';
            // vueInst.article.um1ToUm2 = 1;

            // vueInst.article.sizeLength = null;
            // vueInst.article.sizeWidth = null;
            // vueInst.article.sizeThickness = null;
            // vueInst.article.sizeDiameter = null;
            // vueInst.article.sizeHeight = null;
            // vueInst.article.sizeAlloy = null;
            // vueInst.article.sizeType = null;

            vueInst.article.withLength = (pCategory.withLength == 'y' ? true : false);
            vueInst.article.withWidth = (pCategory.withWidth == 'y' ? true : false);
            vueInst.article.withThickness = (pCategory.withThickness == 'y' ? true : false);
            vueInst.article.withDiameter = (pCategory.withDiameter == 'y' ? true : false);
            vueInst.article.withHeight = (pCategory.withHeight == 'y' ? true : false);
            vueInst.article.withAlloy = (pCategory.withAlloy == 'y' ? true : false);
            vueInst.article.withType = (pCategory.withType == 'y' ? true : false);
        }
    }

    private get optionsCategories():TOptionCategory[]{
      return this.nomenclatoareStore.optionsCategories;
    }

    public getListDataCategoryThenArticleFromDB() : void {
        const vueInst=this;
        ServiceAdminNomCategory.getNomCategorylistData().then(response=>{
            // console.log('response=%o',response)
            if(response.status=='success'){
                vueInst.nomenclatoareStore.set_categories(JSON.parse(JSON.stringify(response.listDataCategories)));
                vueInst.filteredOptionsCategories=vueInst.optionsCategories;
                if(vueInst.pid && vueInst.pid!='0'){
                    vueInst.getArticleFromDB();
                }else{
                    vueInst.$q.loading.hide();
                }
            }
        })
    }

    public getArticleFromDB() : void {
        const vueInst=this;
        if(vueInst.pid && vueInst.pid!='0'){
            ServiceAdminNomProducts.getArticleFromDB(vueInst.pid).then(response=>{
                vueInst.$q.loading.hide();
                const item :TArticleStr= JSON.parse(JSON.stringify(response.product)) as TArticleStr;
                if(response.status=='success'){
                    
                    const categoryPids = parsePostgresArray(item.categoryPid);
                    const lantHierarchyCategory=vueInst.nomenclatoareStore.optionsCategories.filter(category=>{
                        // console.log(categoryPids.includes(category.pid));
                        return categoryPids.includes(category.pid.toString());
                    });
                    const pCategory=vueInst.optionsCategories.find(category=>{
                        return category.pid==categoryPids[0];
                    })
                    vueInst.article= {
                        appid:item.appid,
                        pid:item.pid,
                        categoryPid:item.categoryPid,
                        categories:lantHierarchyCategory,
                        code: item.code,
                        name_ro:item.name_ro,
                        name_en:item.name_en,
                        name_bg:item.name_bg,
                        UMBase:item.UMBase,
                        um1: item.um1,
                        um2: item.um2,
                        um1ToUm2: item.um1ToUm2,
                        isActive:item.isActive=='y'?true:false,
                        withLength: pCategory && pCategory.withLength=='y'?true:false,
                        withWidth: pCategory && pCategory.withWidth=='y'?true:false,
                        withThickness:pCategory && pCategory.withThickness=='y'?true:false,
                        withDiameter: pCategory && pCategory.withDiameter=='y'?true:false,
                        withHeight: pCategory && pCategory.withHeight=='y'?true:false,
                        withAlloy: pCategory && pCategory.withAlloy=='y'?true:false,
                        withType: pCategory && pCategory.withType=='y'?true:false,
                        sizeLength:item.sizeLength,
                        sizeWidth:item.sizeWidth,
                        sizeThickness:item.sizeThickness,
                        sizeDiameter:item.sizeDiameter,
                        sizeHeight:item.sizeHeight,
                        sizeAlloy: item.sizeAlloy,
                        sizeType: item.sizeType
                    }
                }
            })
        }
    }

    public focusOnArticleName() : void {
        this.$refs.refArticleName.focus();
    }

    public focusOnCategorySelection() : void {
        this.$refs.refArticleCategorySelection.focus();
    }

    public focusOnArticleType() : void {
        this.$refs.refArticleType.focus();
    }


    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    filterFnCategories (val:string, update:any) : void  {
        const vueInst=this;

        if (val === '') {
            update(() => {
                vueInst.filteredOptionsCategories=vueInst.optionsCategories;
            })
            return
        }

        update(() => {
            const needle = val.toLowerCase()
            vueInst.filteredOptionsCategories = vueInst.optionsCategories.filter(v => v.lantHierarchyCategoriesRO.toLowerCase().indexOf(needle) > -1 || v.lantHierarchyCategoriesEN.toLowerCase().indexOf(needle) > -1 || v.lantHierarchyCategoriesBG.toLowerCase().indexOf(needle) > -1)
        })
    }

    removeCategory(index: number) : void {
        const vueInst=this;
        console.log('remove categ at index', index);
        vueInst.article.categories.splice(index, 1);
    }

    resetCategoryToAdd(): void {
        const vueInst=this;
        vueInst.categoryToAdd = {
            pid: '',
            name_ro: '',
            name_en: '',
            name_bg: '',
            categories:[] as TOptionCategory[],
            withLength: '',
            withWidth: '',
            withThickness: '',
            withDiameter: '',
            withHeight: '',
            withAlloy: '',
            withType: '',
            lantHierarchyCategoriesRO: '',
            lantHierarchyCategoriesEN: '',
            lantHierarchyCategoriesBG: ''
        }
    }

    adaugaCategorie(): void {
        const vueInst=this;
        // vueInst.article.categories.push(vueInst.categoryToAdd);
        vueInst.resetCategoryToAdd();
    }

    public onReset() : void {
        this.article={
            appid:'',
            pid:'',
            categoryPid:'',
            categories:[],
            code: '',
            name_ro:'',
            name_en:'',
            name_bg:'',
            UMBase:'',
            um1:'',
            um2: '',
            um1ToUm2: 1,
            isActive:false,
            withLength: false,
            withWidth: false,
            withThickness: false,
            withDiameter: false,
            withHeight: false,
            withAlloy: false,
            withType: false,
            sizeLength:0,
            sizeWidth:0,
            sizeThickness:0,
            sizeDiameter:0,
            sizeHeight:0,
            sizeAlloy:'',
            sizeType:''
        }
    }

    public created() : void {
        const vueInst=this;
        vueInst.$q.loading.show();
        vueInst.onReset();
        vueInst.getListDataCategoryThenArticleFromDB();
    }
}
